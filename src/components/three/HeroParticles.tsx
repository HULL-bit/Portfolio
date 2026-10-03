'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing';
import { BlendFunction, type ChromaticAberrationEffect } from 'postprocessing';
import * as THREE from 'three';
import { withBase } from '@/lib/base';
import { heroBus } from '@/lib/hero-bus';
import { LINES_FRAGMENT, LINES_VERTEX, NODES_VERTEX, POINTS_FRAGMENT, POINTS_VERTEX } from '@/shaders/portrait.glsl';

type Tier = 'high' | 'mid';
const CAM_Z = 5;
const FOV = 30;
const WORLD_H = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360); // hauteur visible à z=0

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

function rng(seed: number) {
  return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

type Built = { points: THREE.BufferGeometry; nodes: THREE.BufferGeometry; lines: THREE.BufferGeometry; chaos: THREE.BufferAttribute; count: number };

/** Construit les géométries : points du portrait, nœuds du réseau (sous-ensemble) et lignes entre nœuds proches. */
function build(data: Float32Array, nodeCount: number): Built {
  const n = Math.floor(data.length / 3);
  const r = rng(1337);
  const target = new Float32Array(n * 3), lum = new Float32Array(n), rand = new Float32Array(n * 4), chaos = new Float32Array(n * 3), net = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const l = data[i * 3 + 2]!;
    target.set([data[i * 3]!, data[i * 3 + 1]!, (r() - 0.5) * 0.1 * (0.4 + l)], i * 3);
    lum[i] = l;
    rand.set([r(), r(), r(), r()], i * 4);
    chaos.set([(r() - 0.5) * 6, (r() - 0.5) * 4, (r() - 0.5) * 2], i * 3);
    net.set([r() - 0.5, r() - 0.5, (r() - 0.5) * 0.8], i * 3);
  }
  const points = new THREE.BufferGeometry();
  points.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  points.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
  points.setAttribute('aLum', new THREE.BufferAttribute(lum, 1));
  points.setAttribute('aRand', new THREE.BufferAttribute(rand, 4));
  const chaosAttr = new THREE.BufferAttribute(chaos, 3);
  chaosAttr.setUsage(THREE.DynamicDrawUsage);
  points.setAttribute('aChaos', chaosAttr);
  points.setAttribute('aNet', new THREE.BufferAttribute(net, 3));

  // ── nœuds : échantillon du portrait ; position réseau sur une grille jitterée (répartition homogène) ──
  const cols = Math.ceil(Math.sqrt(nodeCount * 1.7)), rows = Math.ceil(nodeCount / cols);
  const nTarget = new Float32Array(nodeCount * 3), nNet = new Float32Array(nodeCount * 3), nLum = new Float32Array(nodeCount), nRand = new Float32Array(nodeCount * 4);
  const npos: [number, number][] = [];
  for (let k = 0; k < nodeCount; k++) {
    const src = Math.floor(r() * n);
    nTarget.set(target.subarray(src * 3, src * 3 + 3), k * 3);
    nLum[k] = lum[src]!;
    nRand.set([r(), r(), r(), r()], k * 4);
    const cx = ((k % cols) + 0.5 + (r() - 0.5) * 0.8) / cols - 0.5;
    const cy = (Math.floor(k / cols) + 0.5 + (r() - 0.5) * 0.8) / rows - 0.5;
    nNet.set([cx, cy, (r() - 0.5) * 0.8], k * 3);
    npos.push([cx * 1.7, cy]);
  }
  const nodes = new THREE.BufferGeometry();
  nodes.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nodeCount * 3), 3));
  nodes.setAttribute('aTarget', new THREE.BufferAttribute(nTarget, 3));
  nodes.setAttribute('aLum', new THREE.BufferAttribute(nLum, 1));
  nodes.setAttribute('aRand', new THREE.BufferAttribute(nRand, 4));
  nodes.setAttribute('aChaos', new THREE.BufferAttribute(new Float32Array(nodeCount * 3), 3));
  nodes.setAttribute('aNet', new THREE.BufferAttribute(nNet, 3));

  // ── lignes : chaque nœud relié à ses 3 voisins les plus proches (systèmes répartis) ──
  const seen = new Set<string>();
  const idx: number[] = [];
  const maxD = (1.7 / cols) * 1.9;
  for (let i = 0; i < nodeCount; i++) {
    const ds = npos.map((p, j) => [j, Math.hypot(p[0] - npos[i]![0], p[1] - npos[i]![1])] as const).filter(([j, d]) => j !== i && d < maxD).sort((a, b) => a[1] - b[1]).slice(0, 3);
    for (const [j] of ds) { const key = i < j ? `${i}-${j}` : `${j}-${i}`; if (!seen.has(key)) { seen.add(key); idx.push(i, j); } }
  }
  const take = (src: Float32Array, size: number) => { const out = new Float32Array(idx.length * size); idx.forEach((id, v) => out.set(src.subarray(id * size, id * size + size), v * size)); return out; };
  const lines = new THREE.BufferGeometry();
  lines.setAttribute('position', new THREE.BufferAttribute(new Float32Array(idx.length * 3), 3));
  lines.setAttribute('aTarget', new THREE.BufferAttribute(take(nTarget, 3), 3));
  lines.setAttribute('aLum', new THREE.BufferAttribute(take(nLum, 1), 1));
  lines.setAttribute('aRand', new THREE.BufferAttribute(take(nRand, 4), 4));
  lines.setAttribute('aChaos', new THREE.BufferAttribute(new Float32Array(idx.length * 3), 3));
  lines.setAttribute('aNet', new THREE.BufferAttribute(take(nNet, 3), 3));
  for (const g of [points, nodes, lines]) g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100);
  return { points, nodes, lines, chaos: chaosAttr, count: n };
}

type Mouse = { x: number; y: number; px: number; py: number; vx: number; vy: number; tx: number; ty: number; speed: number };

function Scene({ data, tier, wrap }: { data: Float32Array; tier: Tier; wrap: React.RefObject<HTMLDivElement | null> }) {
  const { size, gl } = useThree();
  const built = useMemo(() => build(data, tier === 'high' ? 110 : 60), [data, tier]);
  const ca = useRef<ChromaticAberrationEffect>(null);
  const st = useRef({ started: false, t0: 0, figure: { cx: 0, cyDoc: 0, h: 0 }, mouse: { x: 999, y: 999, px: 0, py: 0, vx: 0, vy: 0, tx: 999, ty: 999, speed: 0 } as Mouse });

  const shared = useMemo(
    () => ({
      uTime: { value: 0 }, uProgress: { value: 0 }, uDisperse: { value: 0 }, uScale: { value: 1 }, uPush: { value: 0 }, uRadius: { value: 0.25 },
      uOffset: { value: new THREE.Vector3() }, uNetScale: { value: new THREE.Vector3(4, 3, 1.6) }, uMouse: { value: new THREE.Vector2(999, 999) },
      uDpr: { value: 1 },
    }),
    [],
  );
  const mats = useMemo(() => {
    const common = { transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending };
    return {
      points: new THREE.ShaderMaterial({ ...common, vertexShader: POINTS_VERTEX, fragmentShader: POINTS_FRAGMENT, uniforms: { ...shared, uSize: { value: tier === 'high' ? 2.3 : 3.1 }, uAlpha: { value: 0 } } }),
      nodes: new THREE.ShaderMaterial({ ...common, vertexShader: NODES_VERTEX, fragmentShader: POINTS_FRAGMENT, uniforms: { ...shared, uAlpha: { value: 0 } } }),
      lines: new THREE.ShaderMaterial({ ...common, vertexShader: LINES_VERTEX, fragmentShader: LINES_FRAGMENT, uniforms: { ...shared, uAlpha: { value: 0 } } }),
    };
  }, [shared, tier]);

  // état initial du chaos : nuage aléatoire à l'échelle du viewport
  useEffect(() => {
    const wu = WORLD_H / size.height;
    const a = built.chaos.array as Float32Array;
    for (let i = 0; i < built.count; i++) { a[i * 3] = (a[i * 3]! / 6) * size.width * wu * 1.3; a[i * 3 + 1] = (a[i * 3 + 1]! / 4) * size.height * wu * 1.3; }
    built.chaos.needsUpdate = true;
  }, [built, size.width, size.height]);

  // mesure du cadre du portrait (la figure HTML sert de gabarit)
  useEffect(() => {
    const fig = document.querySelector<HTMLElement>('.duotone');
    if (!fig) return;
    const measure = () => {
      const r = fig.getBoundingClientRect();
      st.current.figure = { cx: r.left + r.width / 2, cyDoc: r.top + window.scrollY + r.height / 2, h: r.height };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(fig);
    document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // souris → répulsion
  useEffect(() => {
    const m = st.current.mouse;
    const onMove = (e: PointerEvent) => { if (e.pointerType === 'touch') return; m.tx = e.clientX; m.ty = e.clientY; if (m.x > 900) { m.x = m.tx; m.y = m.ty; } };
    const onLeave = () => { m.tx = 999999; m.ty = 999999; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => { window.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', onLeave); };
  }, []);

  // démarrage : après l'implosion du boot (positions de départ = texte) ou immédiatement
  useEffect(() => {
    const html = document.documentElement;
    const start = (text: Float32Array | null) => {
      if (st.current.started) return;
      if (text && text.length >= 2) {
        const wu = WORLD_H / size.height;
        const a = built.chaos.array as Float32Array;
        const m = text.length / 2;
        for (let i = 0; i < built.count; i++) {
          const k = (i % m) * 2;
          a[i * 3] = (text[k]! - size.width / 2) * wu;
          a[i * 3 + 1] = -(text[k + 1]! - size.height / 2) * wu;
          a[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
        }
        built.chaos.needsUpdate = true;
      }
      st.current.started = true;
      st.current.t0 = performance.now() / 1000;
      html.classList.add('hero-3d-on');
    };
    const unsub = heroBus.onImplode(start);
    const t = setTimeout(() => start(null), html.classList.contains('booting') ? 4500 : 0);
    return () => { unsub(); clearTimeout(t); };
  }, [built, size.width, size.height]);

  useEffect(() => { shared.uDpr.value = gl.getPixelRatio(); }, [gl, shared]);
  useEffect(() => () => { built.points.dispose(); built.nodes.dispose(); built.lines.dispose(); Object.values(mats).forEach((m) => m.dispose()); }, [built, mats]);

  useFrame((state) => {
    const s = st.current;
    const wu = WORLD_H / size.height;
    const sy = window.scrollY;
    const now = performance.now() / 1000;
    const el = s.started ? now - s.t0 : 0;
    shared.uTime.value = state.clock.elapsedTime;
    shared.uProgress.value = clamp01(el / 2.6);
    const alpha = clamp01(el / 0.45);

    const f = s.figure;
    const scale = (f.h * wu) / 2;
    shared.uScale.value = scale;
    shared.uOffset.value.set((f.cx - size.width / 2) * wu, -(f.cyDoc - sy - size.height / 2) * wu, 0);
    shared.uNetScale.value.set(size.width * wu * 1.15, size.height * wu * 1.15, 1.6);
    shared.uRadius.value = 0.25 * scale;

    // désagrégation du portrait en réseau, liée au scroll
    const s0 = Math.max(0, f.cyDoc - size.height * 0.55);
    const s1 = s0 + size.height * 0.85;
    const disperse = clamp01((sy - s0) / (s1 - s0));
    shared.uDisperse.value = disperse;
    const fade = 1 - smooth(s1 + size.height * 0.7, s1 + size.height * 1.8, sy);
    // en colonne unique (mobile), la figure est sous le texte : les particules n'apparaissent que quand elle entre à l'écran
    const figTop = f.cyDoc - f.h / 2 - sy;
    const vis = 1 - smooth(size.height * 0.6, size.height * 0.95, figTop);
    if (wrap.current) wrap.current.style.opacity = String(fade * vis);

    // ressort élastique de la souris
    const m = s.mouse;
    m.vx = m.vx * 0.82 + (m.tx - m.x) * 0.1;
    m.vy = m.vy * 0.82 + (m.ty - m.y) * 0.1;
    m.x += m.vx; m.y += m.vy;
    m.speed = m.speed * 0.9 + Math.hypot(m.x - m.px, m.y - m.py) * 0.1;
    m.px = m.x; m.py = m.y;
    shared.uMouse.value.set((m.x - size.width / 2) * wu, -(m.y - size.height / 2) * wu);
    shared.uPush.value = 0.13 * scale;
    if (ca.current) ca.current.offset.set(Math.min(m.speed, 40) * 0.00018, Math.min(m.speed, 40) * 0.00009);

    mats.points.uniforms.uAlpha!.value = alpha;
    mats.nodes.uniforms.uAlpha!.value = alpha;
    mats.lines.uniforms.uAlpha!.value = alpha;
  });

  return (
    <>
      <points geometry={built.points} material={mats.points} frustumCulled={false} />
      <points geometry={built.nodes} material={mats.nodes} frustumCulled={false} />
      <lineSegments geometry={built.lines} material={mats.lines} frustumCulled={false} />
      {tier === 'high' ? (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
          <Noise opacity={0.035} blendFunction={BlendFunction.SOFT_LIGHT} />
          <ChromaticAberration ref={ca} offset={new THREE.Vector2(0, 0)} radialModulation={false} modulationOffset={0} />
        </EffectComposer>
      ) : null}
    </>
  );
}

export default function HeroParticles({ tier, label }: { tier: Tier; label: string }) {
  const [data, setData] = useState<Float32Array | null>(null);
  const [active, setActive] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let off = false;
    fetch(withBase(tier === 'high' ? '/data/portrait.bin' : '/data/portrait-sm.bin'))
      .then((r) => r.arrayBuffer())
      .then((b) => { if (!off) setData(new Float32Array(b)); })
      .catch(() => {});
    return () => { off = true; };
  }, [tier]);

  // pause hors écran : le canvas ne tourne plus quand le Hero et le réseau sont loin au-dessus
  useEffect(() => {
    const onScroll = () => setActive(window.scrollY < window.innerHeight * 4.2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!data) return null;
  return (
    <div ref={wrap} className="hero-3d" role="img" aria-label={label}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, CAM_Z], fov: FOV, near: 0.1, far: 50 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
      >
        <Scene data={data} tier={tier} wrap={wrap} />
      </Canvas>
    </div>
  );
}
