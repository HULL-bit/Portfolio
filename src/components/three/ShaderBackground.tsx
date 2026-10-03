'use client';
import { useEffect, useRef } from 'react';
import { BG_FRAGMENT, BG_VERTEX } from '@/shaders/background.glsl';
import { prefersReducedMotion, type Tier } from '@/lib/gpu-tier';

type RGB = [number, number, number];
/** Palette par section : [principale, secondaire, fond, veines or]. */
const PALETTES: Record<string, [RGB, RGB, RGB, number]> = {
  hero:        [[0.10, 0.14, 0.52], [0.30, 0.10, 0.52], [0.016, 0.02, 0.04], 0.5],
  about:       [[0.08, 0.14, 0.45], [0.18, 0.08, 0.40], [0.016, 0.02, 0.04], 0.3],
  stack:       [[0.04, 0.22, 0.42], [0.10, 0.10, 0.44], [0.016, 0.02, 0.04], 0.2],
  experience:  [[0.12, 0.10, 0.46], [0.24, 0.07, 0.40], [0.016, 0.02, 0.04], 0.3],
  projects:    [[0.16, 0.08, 0.50], [0.34, 0.07, 0.42], [0.016, 0.018, 0.04], 0.9],
  skills:      [[0.04, 0.24, 0.40], [0.10, 0.10, 0.46], [0.014, 0.02, 0.04], 0.5],
  journey:     [[0.14, 0.10, 0.44], [0.08, 0.16, 0.40], [0.016, 0.02, 0.04], 0.4],
  github:      [[0.08, 0.12, 0.42], [0.16, 0.07, 0.36], [0.016, 0.02, 0.04], 0.2],
  contact:     [[0.20, 0.10, 0.52], [0.34, 0.14, 0.30], [0.016, 0.02, 0.04], 1],
};
const ORDER = Object.keys(PALETTES);

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}

export default function ShaderBackground({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, BG_VERTEX));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, BG_FRAGMENT));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    } catch {
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = Object.fromEntries(['uRes', 'uTime', 'uSection', 'uA', 'uB', 'uC', 'uVein', 'uLight'].map((n) => [n, gl.getUniformLocation(prog, n)]));

    const scale = tier === 'high' ? 0.55 : 0.35; // rendu basse résolution : fond flou par nature
    const resize = () => {
      canvas.width = Math.max(2, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(2, Math.round(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // état courant (interpolé) et cible
    const cur = { a: [...PALETTES.hero![0]] as RGB, b: [...PALETTES.hero![1]] as RGB, c: [...PALETTES.hero![2]] as RGB, vein: 0.5, section: 0 };
    let target = PALETTES.hero!;
    let targetIndex = 0;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id], .hero'));
    const visible = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target, e.intersectionRatio);
        let best: Element | null = null;
        let max = 0;
        visible.forEach((r, el) => { if (r > max) { max = r; best = el; } });
        if (best) {
          const el = best as HTMLElement;
          const id = el.classList.contains('hero') ? 'hero' : el.id;
          if (PALETTES[id]) { target = PALETTES[id]; targetIndex = ORDER.indexOf(id); }
        }
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => io.observe(s));

    const reduced = prefersReducedMotion();
    let raf = 0;
    let last = 0;
    let time = Math.random() * 100;
    const frameGap = tier === 'high' ? 1000 / 45 : 1000 / 30;

    const draw = (dt: number) => {
      const k = 1 - Math.exp(-dt * 2.2);
      for (let i = 0; i < 3; i++) {
        cur.a[i] = cur.a[i]! + (target[0][i]! - cur.a[i]!) * k;
        cur.b[i] = cur.b[i]! + (target[1][i]! - cur.b[i]!) * k;
        cur.c[i] = cur.c[i]! + (target[2][i]! - cur.c[i]!) * k;
      }
      cur.vein += (target[3] - cur.vein) * k;
      cur.section += (targetIndex - cur.section) * k;
      gl.uniform2f(U.uRes!, canvas.width, canvas.height);
      gl.uniform1f(U.uTime!, time);
      gl.uniform1f(U.uSection!, cur.section);
      gl.uniform3fv(U.uA!, cur.a);
      gl.uniform3fv(U.uB!, cur.b);
      gl.uniform3fv(U.uC!, cur.c);
      gl.uniform1f(U.uVein!, cur.vein);
      gl.uniform1f(U.uLight!, document.documentElement.dataset.theme === 'light' ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < frameGap) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      time += dt;
      draw(dt);
    };
    const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVis = () => (document.hidden ? stop() : start()); // pause quand l'onglet est caché
    document.addEventListener('visibilitychange', onVis);

    draw(1);            // première image immédiate (aussi la seule en reduced-motion)
    canvas.dataset.ready = 'true';
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [tier]);

  return <canvas ref={ref} className="bg-canvas" aria-hidden="true" />;
}
