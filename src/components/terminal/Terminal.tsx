'use client';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { runtime, scrollToTarget } from '@/lib/runtime';
import { toggleTheme } from '@/lib/theme';
import { track } from '@/lib/track';

export type TerminalData = {
  lang: 'fr' | 'en';
  prompt: string;
  welcome: string[];
  commands: { name: string; usage: string; description: string }[];
  projects: { slug: string; title: string; href: string }[];
  skills: { name: string; items: { name: string; level: number }[] }[];
  curriculum: { name: string; items: string[] }[];
  whoami: string[];
  uname: string[];
  neofetchLogo: string[];
  neofetchInfo: string[];
  cv: { href: string; lines: string[] };
  contact: { label: string; value: string; href?: string }[];
  msg: { sudoPassword: string; sudoGranted: string; notFound: string; unknownProject: string; usageLang: string; opening: string; themeToggled: string; langTo: string; download: string };
  home: string;
  nextLang: { fr: string; en: string };
  labels: { title: string; close: string };
};
type Line = { text: string; kind?: 'in' | 'err' | 'ok' | 'dim'; href?: string };

const bar = (n: number) => '●'.repeat(n) + '○'.repeat(5 - n);

/** Terminal plein écran (touche ` ou bouton >_). Réponses issues de content/terminal.json et des contenus du site. */
export function Terminal({ data, initialOpen = false }: { data: TerminalData; initialOpen?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(initialOpen);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<'cmd' | 'password'>('cmd');
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  const print = useCallback((ls: Line[]) => setLines((cur) => [...cur, ...ls]), []);
  const close = useCallback(() => setOpen(false), []);

  // ouverture : touche ` (hors champs de saisie) ou événement du bouton
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (e.key === '`' && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === 'Escape' && open) setOpen(false);
    };
    const onEvt = () => setOpen((o) => !o);
    window.addEventListener('keydown', onKey);
    window.addEventListener('diaw:terminal', onEvt);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('diaw:terminal', onEvt); };
  }, [open]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('terminal-open', open);
    if (open) {
      runtime.lenis?.stop();
      setLines((cur) => (cur.length ? cur : data.welcome.map((text) => ({ text, kind: 'dim' as const }))));
      requestAnimationFrame(() => input.current?.focus());
    } else runtime.lenis?.start();
    return () => html.classList.remove('terminal-open');
  }, [open, data.welcome]);

  useEffect(() => { out.current?.scrollTo({ top: out.current.scrollHeight }); }, [lines]);
  // ferme le terminal quand la page change (pas au premier rendu : il peut être monté déjà ouvert)
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) { lastPath.current = pathname; setOpen(false); }
  }, [pathname]);

  const goContact = () => {
    setOpen(false);
    if (pathname === data.home) scrollToTarget('#contact');
    else router.push(`${data.home}#contact`);
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    const [name = '', ...args] = cmd.split(/\s+/);
    const arg = args.join(' ');
    print([{ text: `${data.prompt} ${raw}`, kind: 'in' }]);
    if (!cmd) return;
    history.current.push(cmd);
    cursor.current = history.current.length;
    switch (name) {
      case 'help': print(data.commands.map((c) => ({ text: `${c.usage.padEnd(18)} ${c.description}` }))); break;
      case 'whoami': print(data.whoami.map((text) => ({ text }))); break;
      case 'ls':
        if (arg === 'cursus' || arg === 'curriculum') {
          print(data.curriculum.flatMap((d) => [{ text: `[${d.name}]`, kind: 'ok' as const }, { text: `  ${d.items.join(' · ')}` }]));
          break;
        }
        print(data.projects.map((p, i) => ({ text: `${String(i + 1).padStart(2, '0')}  ${p.slug.padEnd(20)} ${p.title}`, href: p.href })));
        break;
      case 'open': {
        const p = data.projects.find((x) => x.slug === arg);
        if (!p) { print([{ text: data.msg.unknownProject.replace('{slug}', arg || '?'), kind: 'err' }]); break; }
        print([{ text: data.msg.opening.replace('{slug}', p.slug), kind: 'ok' }]);
        setTimeout(() => { setOpen(false); router.push(p.href); }, 450);
        break;
      }
      case 'cat':
        if (arg === 'cv') { print([...data.cv.lines.map((text) => ({ text })), { text: `→ ${data.msg.download}`, href: data.cv.href, kind: 'ok' }]); track('cv-download'); }
        else print([{ text: `cat: ${arg || '?'}`, kind: 'err' }]);
        break;
      case 'skills':
        print(data.skills.flatMap((d) => [{ text: `[${d.name}]`, kind: 'ok' as const }, ...d.items.map((i) => ({ text: `  ${i.name.padEnd(26)} ${bar(i.level)}` }))]));
        break;
      case 'uname': print(data.uname.map((text) => ({ text }))); break;
      case 'neofetch': {
        const n = Math.max(data.neofetchLogo.length, data.neofetchInfo.length);
        print(Array.from({ length: n }, (_, i) => ({ text: `${(data.neofetchLogo[i] ?? '').padEnd(16)} ${data.neofetchInfo[i] ?? ''}` })));
        break;
      }
      case 'contact': print(data.contact.map((c) => ({ text: `${c.label.padEnd(10)} ${c.value}`, href: c.href }))); break;
      case 'lang': {
        if (arg !== 'fr' && arg !== 'en') { print([{ text: data.msg.usageLang, kind: 'err' }]); break; }
        print([{ text: data.msg.langTo.replace('{lang}', arg), kind: 'ok' }]);
        const rest = pathname.replace(/^\/(fr|en)/, '');
        setTimeout(() => { setOpen(false); router.push(`/${arg}${rest || '/'}`); }, 350);
        break;
      }
      case 'theme': toggleTheme(); print([{ text: data.msg.themeToggled, kind: 'ok' }]); break;
      case 'sudo':
        if (arg === 'hire-me') { print([{ text: data.msg.sudoPassword, kind: 'dim' }]); setMode('password'); }
        else print([{ text: data.msg.notFound.replace('{cmd}', cmd), kind: 'err' }]);
        break;
      case 'clear': setLines([]); break;
      case 'exit': setOpen(false); break;
      default: print([{ text: data.msg.notFound.replace('{cmd}', name), kind: 'err' }]);
    }
  };

  const submit = () => {
    if (mode === 'password') {
      print([{ text: '•'.repeat(Math.max(4, value.length)), kind: 'dim' }, { text: data.msg.sudoGranted, kind: 'ok' }]);
      setMode('cmd'); setValue('');
      setTimeout(goContact, 1100);
      return;
    }
    run(value);
    setValue('');
  };

  const complete = () => {
    const parts = value.split(/\s+/);
    if (parts.length <= 1) {
      const hit = data.commands.map((c) => c.name).filter((n) => n.startsWith(parts[0] ?? ''));
      if (hit.length === 1) setValue(`${hit[0]} `);
      else if (hit.length > 1) print([{ text: hit.join('  '), kind: 'dim' }]);
    } else if (parts[0] === 'open') {
      const hit = data.projects.filter((p) => p.slug.startsWith(parts[1] ?? ''));
      if (hit.length === 1) setValue(`open ${hit[0]!.slug}`);
    } else if (parts[0] === 'lang') setValue(`lang ${'fr'.startsWith(parts[1] ?? '') ? 'fr' : 'en'}`);
    else if (parts[0] === 'ls') setValue('cursus'.startsWith(parts[1] ?? '') && (parts[1] ?? '').length > 0 && !'projects'.startsWith(parts[1] ?? '') ? 'ls cursus' : 'ls projects');
    else if (parts[0] === 'cat') setValue('cat cv');
    else if (parts[0] === 'sudo') setValue('sudo hire-me');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
    else if (e.key === 'Tab') { e.preventDefault(); if (mode === 'cmd') complete(); }
    else if (e.key === 'ArrowUp' && mode === 'cmd') { e.preventDefault(); cursor.current = Math.max(0, cursor.current - 1); setValue(history.current[cursor.current] ?? ''); }
    else if (e.key === 'ArrowDown' && mode === 'cmd') { e.preventDefault(); cursor.current = Math.min(history.current.length, cursor.current + 1); setValue(history.current[cursor.current] ?? ''); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  // focus trap minimal : le focus reste dans le terminal
  const onRootKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const f = root.current?.querySelectorAll<HTMLElement>('button, input, a[href]');
    if (!f?.length) return;
    const first = f[0]!, last = f[f.length - 1]!;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  };

  return (
    <div ref={root} className={`terminal${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label={data.labels.title} inert={!open} onKeyDown={onRootKey} onClick={() => input.current?.focus()}>
      <div className="terminal-bar">
        <span className="mono">{data.labels.title}</span>
        <button type="button" className="icon-btn" onClick={close} aria-label={data.labels.close}>×</button>
      </div>
      <div ref={out} className="terminal-out" aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={`tline ${l.kind ?? ''}`}>
            {l.href ? <a href={l.href} onClick={() => { if (!l.href?.startsWith('http')) setOpen(false); }} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>{l.text}</a> : l.text}
          </p>
        ))}
      </div>
      <label className="terminal-in">
        <span className="mono">{mode === 'password' ? '[sudo]' : data.prompt}</span>
        <input ref={input} type={mode === 'password' ? 'password' : 'text'} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label={data.labels.title} />
      </label>
    </div>
  );
}
