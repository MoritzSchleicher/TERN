"use client";

import { Constants } from "@/constants/general_constants";
import { GlobeState } from "@/types/main_game_types";
import { useEffect, useRef } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type Pin = { lat: number; lng: number; label?: string; color?: string };


export type GlobeAPI = {
  flyTo: (lat: number, lng: number, altitude?: number, ms?: number) => Promise<void>;
  setPin: (pin: Pin, opts?: { altitude?: number; radius?: number }) => void;
  clearPin: () => void;
};

export type Props = {
  pin?: Pin; // optional weiterhin als Prop nutzbar
  onReady?: (api: GlobeAPI) => void;
  globe_state: GlobeState
};


let flags: Pin[] = [];

// *────────────────────────────────
// * LEARN: // * LEARN: In React teilt man Logik mit Hooks (Funktionen wie useState, useEffect),
// * statt über Vererbung. Ein eigener Hook kapselt Logik und kann in beliebigen
// * Komponenten wiederverwendet werden:
//
// *   function useCounter(initial = 0) {
// *     const [count, setCount] = React.useState(initial);
// *     const inc = () => setCount(c => c + 1);
// *     return { count, inc };
// *   }
//
// *   function Counter() {
// *     const { count, inc } = useCounter();
// *     return <button onClick={inc}>Count: {count}</button>;
// *   }
// *
// *
// * Wann State, Variable oder Ref?
// * - Soll sich die UI bei Änderung neu rendern? → useState
// *   (z. B. count, Name, Input, Modal offen)
// * - Nur temporär in einer Funktion, ohne Render-Effekt? → normale Variable
// *   (z. B. Schleifenwert, lokale Berechnung)
// * - Wert soll über Renders bestehen, aber kein Re-Render auslösen? → useRef
// *   (z. B. DOM-Ref, Timer-ID, Three.js-Objekt)
// * 
// *────────────────────────────────
export default function GlobeView({ pin, onReady, globe_state = GlobeState.READY }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null); // three-globe Instanz#

  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // (A) onReady als Ref halten
  const onReadyRef = useRef<Props["onReady"]>(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);


  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;
    let renderer: any;
    let scene: any;
    let camera: any;
    let raf = 0;
    
    let onResize: () => void;
    let cleanupExtraListeners = () => {};
    let resolveCurrentFlight: (() => void) | null = null;
    let activeTween = 0;

    (async () => {
      const [
        { Scene, Color, WebGLRenderer, PerspectiveCamera, AmbientLight, DirectionalLight, Vector3 },
        { default: ThreeGlobe },
      ] = await Promise.all([import("three"), import("three-globe")]);
      const [{ OrbitControls }] = await Promise.all([
        import("three/examples/jsm/controls/OrbitControls.js"),
      ]);

      if (disposed) return;
      el.textContent = "";

      // --- Three.js Grundsetup
      scene = new Scene();
      scene.background = new Color("#0B1020");

      renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);

      camera = new PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 1000);
      camera.position.set(0, 0, 250);
      cameraRef.current = camera;

      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 200;
      controls.maxDistance = 400;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = Constants.GLOBE.ROTATION_SPEED;

      scene.add(new AmbientLight(0xffffff, 0.5));
      const dirLight = new DirectionalLight(0xfff5ec, 0.7);
      dirLight.position.set(1, 0.7, 1);
      scene.add(dirLight);

      /*
      ╔═════════════════════════════════════════════════════════════════════════════╗
      ║                                                                             ║
      ║                               GLOBE                                         ║
      ║                                                                             ║
      ╚═════════════════════════════════════════════════════════════════════════════╝
      */
      const globe: any = new ThreeGlobe()
        .globeImageUrl("/textures/earth.jpg")
        .bumpImageUrl("/textures/earth-bump.jpg")
        .showAtmosphere(true)
        .atmosphereColor("#6BB6E9")
        .atmosphereAltitude(0.2);

      scene.add(globe);
      globeRef.current = globe;
      (globe as any).controls?.(controls);
      (globe as any).setPointOfView?.(camera);
      camera.position.set(Constants.GLOBE.START_POS.x, Constants.GLOBE.START_POS.y, Constants.GLOBE.START_POS.z);

      /* -------------------------------------------------------------------------- */

      /*
      ╔═════════════════════════════════════════════════════════════════════════════╗
      ║                                                                             ║
      ║                               LÄNDER                                        ║
      ║                                                                             ║
      ╚═════════════════════════════════════════════════════════════════════════════╝
      */
      fetch("/data/countries.geo.json")
        .then((r) => r.json())
        .then((geo) => {
          globe
            .polygonsData(geo.features)
            .polygonAltitude(() => 0.0005)
            .polygonCapColor(() => "rgba(255,255,255,0.03)")
            .polygonSideColor(() => "rgba(111,231,231,0.10)")
            .polygonStrokeColor(() => "rgba(111,231,231,0.25)");
        })
        .catch(() => {});

      /* -------------------------------------------------------------------------- */

      // Resize
      onResize = () => {
        const { clientWidth, clientHeight } = el;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      function altitudeToDistance(altitude: number) {
        return Constants.GLOBE.RADIUS * altitude * 2.2;
      }

      function latLngToVec3(lat: number, lng: number, r = Constants.GLOBE.RADIUS) {
        const DEG2RAD = Math.PI / 180;
        const latRad = lat * DEG2RAD;
        const lngRad = (lng + Constants.GLOBE.LON_OFFSET_DEG) * DEG2RAD;
        const x = r * Math.cos(latRad) * Math.cos(lngRad);
        const y = r * Math.sin(latRad);
        const z = -r * Math.cos(latRad) * Math.sin(lngRad);
        return new Vector3(x, y, z);
      }

      function slerpVec3(a: Vector3, b: Vector3, t: number) {
        const v0 = a.clone().normalize();
        const v1 = b.clone().normalize();
        let dot = v0.dot(v1);
        dot = Math.min(Math.max(dot, -1), 1);
        if (dot > 0.9995) return v0.clone().lerp(v1, t).normalize();
        const theta0 = Math.acos(dot);
        const theta = theta0 * t;
        const v2 = v1.clone().sub(v0.clone().multiplyScalar(dot)).normalize();
        return v0.clone().multiplyScalar(Math.cos(theta)).add(v2.multiplyScalar(Math.sin(theta)));
      }


      /*
      ╔═════════════════════════════════════════════════════════════════════════════╗
      ║                                                                             ║
      ║                               FlyTo                                         ║
      ║                                                                             ║
      ╚═════════════════════════════════════════════════════════════════════════════╝
      */
      function flyTo(lat: number, lng: number, altitude = 1.4, ms = 1200): Promise<void> {
        // Zielrichtung + Startwerte
        const targetDir = latLngToVec3(lat, lng, 1).normalize();
        const startDist = camera.position.length();
        const startDir = camera.position.clone().normalize();
        const endDist = altitudeToDistance(altitude);

        // ggf. alten Flug abbrechen und Promise auflösen,
        // damit keine "hängenden" awaits bleiben:
        if (activeTween) cancelAnimationFrame(activeTween);
        resolveCurrentFlight?.();

        const t0 = performance.now();

        return new Promise<void>((resolve) => {
          resolveCurrentFlight = resolve;

          const step = () => {
            const t = Math.min(1, (performance.now() - t0) / ms);
            const k = easeInOutCubic(t);

            const dirNow = slerpVec3(startDir, targetDir, k);
            let distNow = startDist + (endDist - startDist) * k;

            if (t > 0.7) {
              const zoomPhase = (t - 0.7) / 0.3;
              distNow *= 1 - Constants.GLOBE.FINAL_ZOOM * zoomPhase;
            }

            camera.position.copy(dirNow.multiplyScalar(distNow));
            controls.target.copy(Constants.GLOBE.CENTER);
            camera.lookAt(Constants.GLOBE.CENTER);
            controls.update();

            if (t < 1) {
              activeTween = requestAnimationFrame(step);
            } else {
              activeTween = 0;
              resolve();
              resolveCurrentFlight = null;
            }
          };

          activeTween = requestAnimationFrame(step);
        }
      );
    }

      /* -------------------------------------------------------------------------- */

      /*
      ╔═════════════════════════════════════════════════════════════════════════════╗
      ║                                                                             ║
      ║                               PIN                                           ║
      ║                                                                             ║
      ╚═════════════════════════════════════════════════════════════════════════════╝
      */
    // *────────────────────────────────
    // * LEARN: Ein Custom Hook ist wie eine kleine "öffentliche API".
    // * Er gibt State + Funktionen zurück, die jede Komponente nutzen kann,
    // * statt eine Klasse mit public Methoden zu bauen.
    //
    // *   function useCounter(initial = 0) {
    // *     const [count, setCount] = React.useState(initial);
    // *     const inc = () => setCount(c => c + 1);
    // *     return { count, inc }; // quasi public API
    // *   }
    //
    // *   function Counter() {
    // *     const { count, inc } = useCounter();
    // *     return <button onClick={inc}>Count: {count}</button>;
    // *   }
    // * 
    // *────────────────────────────────
      function setPin(pin: Pin, opts?: { altitude?: number; radius?: number }) {
        // dedupe nach Koordinate (nicht .includes, das vergleicht Objekt-Referenzen)
        const key = `${pin.lat.toFixed(6)},${pin.lng.toFixed(6)}`;
        const i = flags.findIndex(p => `${p.lat.toFixed(6)},${p.lng.toFixed(6)}` === key);
        if (i === -1) flags.push(pin); else flags[i] = { ...flags[i], ...pin };

        // Accessors: Farbe/Radius/Altitude/Label pro Punkt
        globe.pointColor?.((d: Pin) => d.color ?? "#6FE7E7");
        globe.pointRadius?.((d: Pin) => opts?.radius ?? 0.4);
        globe.pointAltitude?.((d: Pin) => opts?.altitude ?? 0.02);
        globe.pointLabel?.((d: Pin) => d.label ?? ""); // oder globe.pointLabel?.("label")

        // Daten setzen (neue Array-Referenz triggert Updates zuverlässiger)
        globe.pointsData?.([...flags]);
      }

      function clearPin() {
        flags = [];
        globe.pointsData?.([]);
      }

      /* -------------------------------------------------------------------------- */

      /*
      ╔═══════════════════════════════════════╗
      ║              API NACH AUßEN           ║
      ╚═══════════════════════════════════════╝
      */
      onReadyRef.current?.({ flyTo, setPin, clearPin });

      /*
      ╔═══════════════════════════════════════╗
      ║              RENDER LOOP              ║
      ╚═══════════════════════════════════════╝
      */
      const animate = () => {
        if (disposed) return;
        raf = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      /*
      ╔═══════════════════════════════════════╗
      ║                 CLEANUP               ║
      ╚═══════════════════════════════════════╝
      */
      cleanupExtraListeners = () => {
        window.removeEventListener("resize", onResize);
        if (activeTween) cancelAnimationFrame(activeTween);
      };
    })
    ();

    return () => {
      disposed = true;
      if (activeTween) cancelAnimationFrame(activeTween);
      resolveCurrentFlight?.();
      resolveCurrentFlight = null;
      cancelAnimationFrame(raf);
      cleanupExtraListeners();
      if (renderer) {
        try {
          renderer.dispose?.();
        } catch {}
        const el = containerRef.current;
        if (el && renderer.domElement && el.contains(renderer.domElement)) {
          el.removeChild(renderer.domElement);
        }
      }
      (scene as any)?.clear?.();
      globeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    switch (globe_state) {
      case GlobeState.LOCKED:
        controls.autoRotate = false;
        // optional richtig „locken“:
        // controls.enableRotate = false;
        // controls.enableZoom = false;
        // controls.enablePan = false;
        break;

      case GlobeState.AUTO_MOVING:
        // optional wieder freigeben:
        // controls.enableRotate = true;
        controls.autoRotate = true;
        break;

      case GlobeState.READY:
        camera.position.set(Constants.GLOBE.START_POS.x, Constants.GLOBE.START_POS.y, Constants.GLOBE.START_POS.z);
        camera.lookAt(0, 0, 0);
        break;
    }

    controls.update();
  }, [globe_state]);


  // Optional: weiterhin Prop-Änderungen spiegeln
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    if (pin) {
      const pts = [
        {
          lat: pin.lat,
          lng: pin.lng,
          label: pin.label,
          color: pin.color ?? "#6FE7E7",
        },
      ];
      globe.pointsData?.(pts);
      globe.setPointOfView?.({ lat: pin.lat, lng: pin.lng, altitude: 1.4 }, 1000) ??
        globe.pointOfView?.({ lat: pin.lat, lng: pin.lng, altitude: 1.4 }, 1000);
    } else {
      globe.pointsData?.([]);
    }
  }, [pin]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
