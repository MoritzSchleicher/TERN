// src/globe/GlobeView.tsx
"use client";
import { useEffect, useRef } from "react"
import * as THREE from "three"
import Globe from "three-globe"

type Pin = { lat: number; lng: number; label?: string; color?: string }

type Props = {
  pin?: Pin
  onReady?: (api: { flyTo: (lat: number, lng: number, altitude?: number, ms?: number) => void }) => void
}

export default function GlobeView({ pin, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const globeRef = useRef<any>(null) // drei-globe Instanz für spätere Updates (Pins etc.)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // --- Three.js Grundsetup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#0B1020")

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 250)

    // Soft Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(1, 1, 1)
    scene.add(dir)

    // --- Globe-Instanz
    const globe: any = new (Globe as any)()
      .globeImageUrl("/textures/earth.jpg")
      .bumpImageUrl("/textures/earth-bump.jpg")
      .showAtmosphere(true)
      .atmosphereColor("#6FE7E7")
      .atmosphereAltitude(0.18)

    // (Optionale) Default-Settings für Punkte
    if (globe.pointAltitude) globe.pointAltitude(0.02)
    if (globe.pointColor) globe.pointColor(() => "#6FE7E7")
    if (globe.pointRadius) globe.pointRadius(0.4) // in manchen Versionen heißt das pointSize

    scene.add(globe)
    globeRef.current = globe

    // Ländergrenzen laden (optional)
    fetch("/data/countries.geo.json")
      .then((r) => r.json())
      .then((geo) => {
        globe
          .polygonsData(geo.features)
          .polygonCapColor(() => "rgba(255,255,255,0.03)")
          .polygonSideColor(() => "rgba(111,231,231,0.10)")
          .polygonStrokeColor(() => "rgba(111,231,231,0.25)")
      })
      .catch(() => {})

    // rudimentäre Drag-Rotation (mit sauberem Cleanup)
    let isDragging = false
    let prev = { x: 0, y: 0 }
    const onDown = (e: MouseEvent) => {
      isDragging = true
      prev = { x: e.clientX, y: e.clientY }
    }
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      prev = { x: e.clientX, y: e.clientY }
      globe.rotation.y += dx * 0.005
      globe.rotation.x += dy * 0.005
    }
    const onUp = () => { isDragging = false }

    renderer.domElement.addEventListener("mousedown", onDown)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)

    // Resize
    const onResize = () => {
      const { clientWidth, clientHeight } = el
      renderer.setSize(clientWidth, clientHeight)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener("resize", onResize)

    // API nach außen geben – hier casten wir NUR die eine Stelle,
    // weil die Typings von three-globe inkonsistent sind.
    const flyTo = (lat: number, lng: number, altitude = 1.4, ms = 1200) => {
      globe.setPointOfView?.({ lat, lng, altitude }, ms) // wenn Typ erlaubt
        ?? (globe as any).setPointOfView({ lat, lng, altitude }, ms) // Fallback
        ?? (globe as any).pointOfView({ lat, lng, altitude }, ms)    // weitere Fallback-Signatur
    }
    onReady?.({ flyTo })

    // Render-Loop
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      renderer.domElement.removeEventListener("mousedown", onDown)
      renderer.dispose()
      el.removeChild(renderer.domElement)
      scene.clear()
      globeRef.current = null
    }
  }, [onReady])

  // Pins aktualisieren (bei prop-Änderung)
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    if (pin) {
      const pts = [{ lat: pin.lat, lng: pin.lng, label: pin.label, color: pin.color ?? "#6FE7E7" }]
      if (globe.pointsData) {
        globe.pointsData(pts)
      }
      // sanft hinfliegen, wenn Pin gesetzt wird
      if (globe.setPointOfView) {
        globe.setPointOfView({ lat: pin.lat, lng: pin.lng, altitude: 1.4 }, 1000)
      } else if (globe.pointOfView) {
        globe.pointOfView({ lat: pin.lat, lng: pin.lng, altitude: 1.4 }, 1000)
      }
    } else {
      // keine Pins -> leeren
      if (globe.pointsData) globe.pointsData([])
    }
  }, [pin])

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
}
