'use client';
import { useEffect, useState } from 'react';

const SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/** Code Konami → mode `root` (thème vert terminal), réversible en le retapant. Le seul easter egg du site. */
export function Konami() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === SEQ[i] ? i + 1 : k === SEQ[0] ? 1 : 0;
      if (i === SEQ.length) {
        i = 0;
        const d = document.documentElement;
        const on = d.dataset.root !== 'on';
        if (on) d.dataset.root = 'on'; else delete d.dataset.root;
        setMsg(on ? 'root@diaw:~# access level: root' : 'root@diaw:~# exit');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(''), 2600);
    return () => clearTimeout(t);
  }, [msg]);
  return <span role="status" aria-live="polite">{msg ? <span className="toast toast-root mono">{msg}</span> : null}</span>;
}
