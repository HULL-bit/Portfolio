'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Leds } from '@/components/skills/Leds';
import { ACCENT, type RackDomain, type RackLabels } from '@/components/skills/skills-data';

type Ctl = { hover: number | null; selected: number | null };
const PITCH = 0.62;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Étiquette de façade dessinée sur un canvas 2D (polices du site, aucun chargement externe). */
function makeLabel(index: number, name: string, tag: string | null, accent: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 128;
  const g = c.getContext('2d')!;
  g.clearRect(0, 0, c.width, c.height);
  g.fillStyle = accent;
  g.font = '500 30px "JetBrains Mono", monospace';
  g.textBaseline = 'middle';
  g.fillText(String(index + 1).padStart(2, '0'), 24, 66);
  g.fillStyle = '#F5F7FF';
  // largeur disponible : jusqu'à la pastille (tag) ou au bord ; la police rétrécit pour les noms longs
  g.font = '500 24px "JetBrains Mono", monospace';
  const tagW = tag ? g.measureText(tag).width + 36 : 0;
  const room = c.width - 100 - 24 - (tag ? tagW + 48 : 0);
  let px = 54;
  g.font = `700 ${px}px "Clash Display", sans-serif`;
  while (px > 30 && g.measureText(name.toUpperCase()).width > room) { px -= 2; g.font = `700 ${px}px "Clash Display", sans-serif`; }
  g.fillText(name.toUpperCase(), 100, 66);
  if (tag) {
    g.font = '500 24px "JetBrains Mono", monospace';
    const w = tagW;
    g.strokeStyle = accent; g.lineWidth = 2;
    g.beginPath(); g.roundRect(c.width - w - 24, 40, w, 52, 26); g.stroke();
    g.fillStyle = accent; g.fillText(tag, c.width - w - 6, 67);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function Server({ d, index, tag, ctl, leds: ledCount }: { d: RackDomain; index: number; tag: string | null; ctl: React.RefObject<Ctl>; leds: number }) {
  const group = useRef<THREE.Group>(null);
  const ledMesh = useRef<THREE.InstancedMesh>(null);
  const accent = useMemo(() => new THREE.Color(ACCENT[d.id]), [d.id]);
  const tmp = useMemo(() => new THREE.Color(), []);
  const [label, setLabel] = useState<THREE.CanvasTexture | null>(null);
  const blink = useMemo(() => Array.from({ length: ledCount }, () => ({ s: 1.4 + Math.random() * 4.2, p: Math.random() * 6.28, th: -0.35 + Math.random() * 0.7 })), [ledCount]);
  const y = (2 - index) * PITCH;
  const boost = d.primary ? 1.7 : 1;

  useEffect(() => {
    let off = false;
    document.fonts.ready.then(() => { if (!off) setLabel(makeLabel(index, d.name, tag, ACCENT[d.id])); });
    return () => { off = true; };
  }, [index, d.name, d.id, tag]);
  useEffect(() => () => label?.dispose(), [label]);

  useFrame((state, dt) => {
    const g = group.current;
    const m = ledMesh.current;
    if (!g || !m) return;
    const { hover, selected } = ctl.current!;
    const open = (hover ?? selected) === index;
    const target = open ? 1.45 : 0;
    g.position.z += (target - g.position.z) * (1 - Math.exp(-dt * 5.5));
    const t = state.clock.elapsedTime;
    for (let i = 0; i < ledCount; i++) {
      const b = blink[i]!;
      const on = Math.sin(t * b.s + b.p) > b.th;
      tmp.copy(accent).multiplyScalar((on ? 2.4 : 0.1) * boost * (open ? 1.5 : 1));
      m.setColorAt(i, tmp);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  const ledPositions = useMemo(() => Array.from({ length: ledCount }, (_, i) => [-0.25 + i * (1.05 / Math.max(1, ledCount - 1)), -0.14, 0.83] as const), [ledCount]);
  useEffect(() => {
    const m = ledMesh.current;
    if (!m) return;
    const o = new THREE.Object3D();
    ledPositions.forEach(([x, yy, z], i) => { o.position.set(x, yy, z); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    m.instanceMatrix.needsUpdate = true;
  }, [ledPositions]);

  return (
    <group position={[0, y, 0]}>
      <group ref={group}>
        <mesh onPointerOver={(e) => { e.stopPropagation(); ctl.current!.hover = index; }} onPointerOut={() => { if (ctl.current!.hover === index) ctl.current!.hover = null; }} onClick={(e) => { e.stopPropagation(); ctl.current!.selected = ctl.current!.selected === index ? null : index; }}>
          <boxGeometry args={[2.5, 0.52, 1.6]} />
          <meshStandardMaterial color="#1c2448" metalness={0.35} roughness={0.5} />
        </mesh>
        {/* liseré d'accent en haut de la façade */}
        <mesh position={[0, 0.25, 0.805]}>
          <boxGeometry args={[2.5, 0.02, 0.012]} />
          <meshBasicMaterial color={accent.clone().multiplyScalar(d.primary ? 2.6 : 1.2)} toneMapped={false} />
        </mesh>
        {/* baies de disques */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-1.12 + i * 0.21, -0.02, 0.806]}>
            <boxGeometry args={[0.17, 0.34, 0.012]} />
            <meshStandardMaterial color="#070a16" metalness={0.5} roughness={0.6} />
          </mesh>
        ))}
        {label ? (
          <mesh position={[0.34, 0.08, 0.815]}>
            <planeGeometry args={[1.32, 0.165]} />
            <meshBasicMaterial map={label} transparent toneMapped={false} />
          </mesh>
        ) : null}
        <instancedMesh ref={ledMesh} args={[undefined, undefined, ledCount]}>
          <boxGeometry args={[0.055, 0.045, 0.02]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
        <mesh position={[1.12, -0.02, 0.81]}>
          <circleGeometry args={[0.05, 20]} />
          <meshBasicMaterial color={accent.clone().multiplyScalar(2)} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Rig({ domains, ctl, tier, wrap }: { domains: RackDomain[]; ctl: React.RefObject<Ctl>; tier: 'high' | 'mid'; wrap: React.RefObject<HTMLDivElement | null> }) {
  const { camera, size, pointer } = useThree();
  const root = useRef<THREE.Group>(null);
  const look = useMemo(() => new THREE.Vector3(0, 0, 0.2), []);
  useFrame((state, dt) => {
    const el = wrap.current;
    let p = 0.5;
    if (el) { const r = el.getBoundingClientRect(); p = clamp01((window.innerHeight - r.top) / (window.innerHeight + r.height)); }
    const t = state.clock.elapsedTime;
    const wide = size.width / size.height > 1.25;
    const angle = -0.42 + p * 0.84 + pointer.x * 0.2 + Math.sin(t * 0.22) * 0.07;
    const R = wide ? 8.6 : 11.5;
    const k = 1 - Math.exp(-dt * 3);
    camera.position.x += (Math.sin(angle) * R - camera.position.x) * k;
    camera.position.z += (Math.cos(angle) * R - camera.position.z) * k;
    camera.position.y += ((0.5 + pointer.y * 0.35 + (p - 0.5) * 0.7) - camera.position.y) * k;
    camera.lookAt(look);
    if (root.current) root.current.position.x += ((wide ? -1.15 : 0) - root.current.position.x) * k;
  });
  const ledCount = tier === 'high' ? 14 : 9;
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#9fb2ff" />
      <pointLight position={[3, 0.5, 3.5]} intensity={34} distance={12} color="#00E5FF" />
      <pointLight position={[-3.5, -1, 3]} intensity={26} distance={12} color="#FF2E88" />
      <group ref={root}>
        {/* châssis de la baie */}
        {[-1.4, 1.4].map((x) => (
          <mesh key={x} position={[x, 0, 0]}><boxGeometry args={[0.1, 3.7, 1.8]} /><meshStandardMaterial color="#141b38" metalness={0.45} roughness={0.45} /></mesh>
        ))}
        {[-1.78, 1.78].map((y) => (
          <mesh key={y} position={[0, y, 0]}><boxGeometry args={[2.9, 0.1, 1.8]} /><meshStandardMaterial color="#141b38" metalness={0.45} roughness={0.45} /></mesh>
        ))}
        <mesh position={[0, 0, -0.88]}><boxGeometry args={[2.8, 3.6, 0.04]} /><meshStandardMaterial color="#0a0f22" roughness={0.9} /></mesh>
        <gridHelper args={[14, 28, '#3D5AFE', '#1a2566']} position={[0, -1.95, 0]} />
        {domains.map((d, i) => <Server key={d.id} d={d} index={i} tag={d.primary ? 'PRIMARY' : null} ctl={ctl} leds={ledCount} />)}
      </group>
    </>
  );
}

export default function SkillsRack({ domains, labels, tier, visible }: { domains: RackDomain[]; labels: RackLabels; tier: 'high' | 'mid'; visible: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(0);
  const ctl = useRef<Ctl>({ hover: null, selected: 0 });
  const wrap = useRef<HTMLDivElement>(null);

  // le canvas écrit dans ctl (survol 3D) ; on le recopie dans l'état React pour le panneau holographique
  useEffect(() => {
    let raf = 0;
    const sync = () => {
      raf = requestAnimationFrame(sync);
      setHover((h) => (h === ctl.current.hover ? h : ctl.current.hover));
      setSelected((s) => (s === ctl.current.selected ? s : ctl.current.selected));
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, []);

  const select = (i: number | null) => { ctl.current.selected = i; setSelected(i); };
  const active = hover ?? selected;
  const dom = active !== null ? domains[active] : null;

  return (
    <div ref={wrap} className="rack-stage" data-cursor="view">
      <div className="rack-canvas" role="img" aria-label={labels.list}>
        <Canvas dpr={[1, 1.4]} camera={{ position: [0, 0.5, 8.6], fov: 32 }} gl={{ alpha: true, antialias: tier === 'high', powerPreference: 'high-performance' }} frameloop={visible ? 'always' : 'never'}>
          <Rig domains={domains} ctl={ctl} tier={tier} wrap={wrap} />
          {tier === 'high' ? <EffectComposer multisampling={0}><Bloom intensity={1.0} luminanceThreshold={0.35} luminanceSmoothing={0.3} mipmapBlur /></EffectComposer> : null}
        </Canvas>
      </div>

      <div className="rack-tabs" role="group" aria-label={labels.list}>
        {domains.map((d, i) => (
          <button key={d.id} type="button" className="chip chip-btn" aria-pressed={selected === i} onClick={() => select(selected === i ? null : i)} style={{ ['--tab' as string]: ACCENT[d.id] }}>
            <span className="tab-dot" />{d.name}{d.primary ? <em>{labels.primary}</em> : null}
          </button>
        ))}
      </div>

      <aside className={`holo${dom ? ' is-open' : ''}`} aria-live="polite" style={{ ['--tab' as string]: dom ? ACCENT[dom.id] : 'var(--cyan)' }}>
        {dom ? (
          <>
            <header>
              <h3>{dom.name}</h3>
              {dom.primary ? <span className="primary-tag">{labels.primary}</span> : null}
            </header>
            <p className="muted">{dom.blurb}</p>
            <ul>
              {dom.items.map((it) => <li key={it.name} className="led-row"><span>{it.name}</span><Leds level={it.level} label={`${labels.level} ${it.name}`} /></li>)}
            </ul>
          </>
        ) : <p className="muted mono">{labels.hint}</p>}
      </aside>
    </div>
  );
}
