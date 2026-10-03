/** Préfixe un chemin public avec le basePath (GitHub Pages, sous-dossier…). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBase(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}
