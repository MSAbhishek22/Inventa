"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Inventa — 3D inventory shelf (hero).
 * Rotating warehouse rack with glowing stock boxes; one box pulses
 * red when its stock runs low. Auto-plays on first load, drag to
 * rotate, one still frame under prefers-reduced-motion, pauses
 * off-screen. Uses the `three` package already in package.json.
 */
export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 4.6, 8.4);
    camera.lookAt(0, 1.0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffe0b3, 1.3);
    key.position.set(4, 8, 5);
    scene.add(key);

    const world = new THREE.Group();
    scene.add(world);

    const mat = (color: number, roughness = 0.7, emissive = 0x000000, emissiveIntensity = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, emissive, emissiveIntensity });
    const box = (w: number, h: number, d: number, color: number, x: number, y: number, z: number, emissive = 0x000000, ei = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, 0.7, emissive, ei));
      m.position.set(x, y, z);
      world.add(m);
      return m;
    };

    // Floor.
    box(7.2, 0.2, 4.4, 0x1e293b, 0, -0.1, 0);
    // Rack uprights + shelf boards.
    [-2.6, -0.9, 0.9, 2.6].forEach((x) => box(0.14, 3.2, 0.14, 0x475569, x, 1.6, -0.9));
    [-2.6, -0.9, 0.9, 2.6].forEach((x) => box(0.14, 3.2, 0.14, 0x475569, x, 1.6, 0.9));
    [0.35, 1.45, 2.55].forEach((y) => box(5.6, 0.1, 2.0, 0x64748b, 0, y, 0));

    // Glowing stock boxes on the shelves.
    const stockColors = [0x22c55e, 0x38bdf8, 0xf59e0b, 0xa855f7, 0x22c55e, 0x38bdf8];
    const shelves = [0.75, 1.85, 2.95];
    let ci = 0;
    shelves.forEach((y, si) => {
      [-2.1, -0.7, 0.7, 2.1].forEach((x, xi) => {
        if (si === 2 && xi === 3) return; // the low-stock slot stays empty on top
        const c = stockColors[ci++ % stockColors.length];
        box(0.95, 0.62, 0.95, c, x, y, 0, c, 0.35);
      });
    });
    // Low-stock box on the floor, pulsing red.
    const lowStock = box(0.95, 0.62, 0.95, 0xef4444, 2.1, 0.41, 1.6, 0xef4444, 0.6);
    const lowRing = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.72, 32),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    lowRing.rotation.x = -Math.PI / 2;
    lowRing.position.set(2.1, 0.02, 1.6);
    world.add(lowRing);

    // A hand truck (dolly) leaning by the rack.
    box(0.08, 1.4, 0.08, 0x94a3b8, -3.1, 0.7, 1.2);
    box(0.7, 0.08, 0.5, 0x94a3b8, -3.1, 0.08, 1.2);

    let rotY = 0;
    let targetRotY = 0;
    let dragging = false;
    let lastX = 0;
    const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      targetRotY += (e.clientX - lastX) * 0.008;
      lastX = e.clientX;
    };
    const onUp = () => { dragging = false; };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const resize = () => {
      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || 260;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();

    let visible = true;
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.02 });
    io.observe(canvas);

    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      raf = 0;
      const t = clock.getElapsedTime();
      if (!dragging) targetRotY += 0.0016;
      rotY += (targetRotY - rotY) * 0.08;
      world.rotation.y = rotY;
      const pulse = 0.5 + 0.5 * Math.sin(t * 3);
      (lowStock.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.35 + pulse * 0.8;
      lowRing.material.opacity = 0.35 + pulse * 0.55;
      const s = 1 + pulse * 0.12;
      lowRing.scale.set(s, s, 1);
      renderer.render(scene, camera);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) { clock.getDelta(); raf = requestAnimationFrame(frame); } };
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);
    if (reduced) frame();
    else kick();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <canvas
        id="hero3d"
        ref={canvasRef}
        aria-label="3D inventory shelf: a rotating warehouse rack with glowing stock boxes and one low-stock box pulsing red"
        className="h-[260px] w-full rounded-2xl border bg-gradient-to-b from-slate-100 to-slate-50 shadow-inner dark:from-slate-900 dark:to-slate-950"
      />
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Your shelf in 3D — full boxes glow, the red one is running low. Drag to look around.
      </p>
    </div>
  );
}
