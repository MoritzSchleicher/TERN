"use client";

import { useEffect, useRef } from "react";
import type { Vector3 } from "three";

type Pin = { lat: number; lng: number; label?: string; color?: string };

type Props = {
  pin?: Pin;
  onReady?: (api: { flyTo: (lat: number, lng: number, altitude?: number, ms?: number) => void }) => void;
};

export default function GlobeView({ pin, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null); // three-globe Instanz

  // (A) onReady als Ref festhalten, damit der Init-Effekt [] haben kann
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
    const onMove = (e: MouseEvent) => {};
    const onUp = () => {};
    const onDown = (e: MouseEvent) => {};

    let cleanupExtraListeners = () => {};

    (async () => {
      // Nur im Browser laden:
      const [{ Scene, Color, WebGLRenderer, PerspectiveCamera, AmbientLight, DirectionalLight, Vector3 }, { default: ThreeGlobe }] =
        await Promise.all([import("three"), import("three-globe")]);
      const [{ OrbitControls }] = await Promise.all([
        import("three/examples/jsm/controls/OrbitControls.js")
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

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      // sinnvolle Grenzen (je nach Szene anpassen)
      controls.minDistance = 120;
      controls.maxDistance = 500;
      // optional: keine Schwenks über Pol flippen
      controls.enablePan = false;

      // Soft Lights
      scene.add(new AmbientLight(0xffffff, 0.8));
      const dir = new DirectionalLight(0xffffff, 0.6);
      dir.position.set(1, 1, 1);
      scene.add(dir);

      // --- Globe-Instanz
      const globe: any = new ThreeGlobe()
        .globeImageUrl("/textures/earth.jpg")
        .bumpImageUrl("/textures/earth-bump.jpg")
        .showAtmosphere(true)
        .atmosphereColor("#6FE7E7")
        .atmosphereAltitude(0.18);

      // Default-Point-Settings
      if (globe.pointAltitude) globe.pointAltitude(0.02);
      if (globe.pointColor) globe.pointColor(() => "#6FE7E7");
      if (globe.pointRadius) globe.pointRadius(0.4);


      scene.add(globe);
      globeRef.current = globe;
      (globe as any).controls?.(controls);
      /* (globe as any).setPointOfView(camera); */

      // Ländergrenzen
      fetch("/data/countries.geo.json")
        .then((r) => r.json())
        .then((geo) => {
          globe
            .polygonsData(geo.features)
            .polygonAltitude(() => 0)
            .polygonCapColor(() => "rgba(255,255,255,0.03)")
            .polygonSideColor(() => "rgba(111,231,231,0.10)")
            .polygonStrokeColor(() => "rgba(111,231,231,0.25)");
        })
        .catch(() => {});

      // rudimentäre Drag-Rotation
      let isDragging = false;
      let prev = { x: 0, y: 0 };
      const _onDown = (e: MouseEvent) => {
        isDragging = true;
        prev = { x: e.clientX, y: e.clientY };
      };
      const _onMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        prev = { x: e.clientX, y: e.clientY };
        globe.rotation.y += dx * 0.005;
        globe.rotation.x += dy * 0.005;
      };
      const _onUp = () => {
        isDragging = false;
      };

      // Resize
      onResize = () => {
        const { clientWidth, clientHeight } = el;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      // Kugelradius in three-globe ist i.d.R. ~100
      const RADIUS = 100;
      const CENTER = new Vector3(0, 0, 0);
      const LON_OFFSET_DEG = -90; // dein gemessener Versatz

      // Sanftes Easing
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Lat/Lng -> 3D-Punkt auf der Kugel
      function latLngToVec3(lat: number, lng: number, r = RADIUS) {
        const DEG2RAD = Math.PI / 180;
        const latRad = lat * DEG2RAD;
        const lngRad = (lng + LON_OFFSET_DEG) * DEG2RAD; // <-- Offset hier einrechnen

        // Achsen wie zuvor (three-globe kompatibel)
        const x =  r * Math.cos(latRad) * Math.cos(lngRad);
        const y =  r * Math.sin(latRad);
        const z = -r * Math.cos(latRad) * Math.sin(lngRad);

        return new Vector3(x, y, z);
      }


      // mappe "altitude" (gefühlter Zoom) -> Kameradistanz
      function altitudeToDistance(altitude: number) {
        // tweakbar: 2.2 ist ein guter Startwert in deinem Setup
        return RADIUS * altitude * 2.2;
      }
      
      let activeTween = 0;

      
      function slerpVec3(a: Vector3, b: Vector3, t: number) {
        // beide Richtungen normalisieren
        const v0 = a.clone().normalize();
        const v1 = b.clone().normalize();

        // numerisch stabil clampen
        let dot = v0.dot(v1);
        dot = Math.min(Math.max(dot, -1), 1);

        // wenn fast gleich, einfach lerp + normalisieren
        if (dot > 0.9995) {
          return v0.clone().lerp(v1, t).normalize();
        }

        const theta0 = Math.acos(dot);     // Winkel zwischen v0 und v1
        const theta  = theta0 * t;
        const v2 = v1.clone().sub(v0.clone().multiplyScalar(dot)).normalize();

        // Slerp-Formel
        return v0.clone().multiplyScalar(Math.cos(theta)).add(
          v2.multiplyScalar(Math.sin(theta))
        );
      }
      /**
       * Fliegt die Kamera zu lat/lng mit gewünschter "altitude".
       * altitude steuert hier den Abstand-Gefühl, passe den Faktor ruhig an.
       */
      function flyTo(lat: number, lng: number, altitude = 1.4, ms = 1200) {
        // Zielrichtung: Normalvektor zum Oberflächenpunkt
        const targetDir = latLngToVec3(lat, lng, 1).normalize(); // r=1, nur Richtung

        // Start: aktuelle Richtung + Distanz
        const startDist = camera.position.length();
        const startDir  = camera.position.clone().normalize();

        // Ende: Zielrichtung + gewünschte Distanz
        const endDist = altitudeToDistance(altitude);

        // alten Tween abbrechen
        if (activeTween) cancelAnimationFrame(activeTween);
        const t0 = performance.now();

        const step = () => {
          const t = Math.min(1, (performance.now() - t0) / ms);
          const k = easeInOutCubic(t);

          // Richtung slerpen (kürzester Bogen um’s Zentrum)
          const dirNow = slerpVec3(startDir, targetDir, k);
          // Distanz lerpen (Zoom)
          const distNow = startDist + (endDist - startDist) * k;

          // Kamera um’s Zentrum platzieren & zum Zentrum blicken
          camera.position.copy(dirNow.multiplyScalar(distNow));
          controls.target.copy(CENTER);   // PIVOT BLEIBT IMMER ZENTRUM
          camera.lookAt(CENTER);
          controls.update();

          // Wenn deine three-globe-Version das erwartet:
          /* (globe as any).setPointOfView?.(camera); */

          if (t < 1) {
            activeTween = requestAnimationFrame(step);
          }
        };

        activeTween = requestAnimationFrame(step);
      }
      onReadyRef.current?.({ flyTo });


      // Render-Loop
      const animate = () => {
        if (disposed) return;
        raf = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Listener-Cleanup-Closure
      cleanupExtraListeners = () => {
        window.removeEventListener("resize", onResize);
        if (activeTween) cancelAnimationFrame(activeTween);
      };
    })();

    // Cleanup
    return () => {
      disposed = true;                  
      cancelAnimationFrame(raf);
      cleanupExtraListeners();
      if (renderer) {
        try {
          renderer.dispose?.();
        } catch {}
        // Canvas entfernen, falls noch vorhanden
        const el = containerRef.current;
        if (el && renderer.domElement && el.contains(renderer.domElement)) {
          el.removeChild(renderer.domElement);
        }
      }
      // Szene leeren
      (scene as any)?.clear?.();
      globeRef.current = null;
    };
  }, []);

  // Pins aktualisieren (bei prop-Änderung)
  /* useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    if (pin) {
      const pts = [{ lat: pin.lat, lng: pin.lng, label: pin.label, color: pin.color ?? "#6FE7E7" }];
      globe.pointsData?.(pts);
      globe.setPointOfView?.({ lat: pin.lat, lng: pin.lng, altitude: 1.4 }, 1000) ??
        globe.pointOfView?.({ lat: pin.lat, lng: pin.lng, altitude: 1.4 }, 1000);
    } else {
      globe.pointsData?.([]);
    }
  }, [pin]); */

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
