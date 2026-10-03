export type Theme = 'dark' | 'light';
const KEY = 'diaw:theme';

export const getTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function setTheme(t: Theme) {
  const d = document.documentElement;
  if (t === 'light') d.dataset.theme = 'light'; else delete d.dataset.theme;
  try { localStorage.setItem(KEY, t); } catch { /* stockage indisponible */ }
  window.dispatchEvent(new Event('diaw:theme'));
}
export const toggleTheme = () => setTheme(getTheme() === 'light' ? 'dark' : 'light');
