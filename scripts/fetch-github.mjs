// Récupère les données GitHub publiques AU BUILD uniquement → content/github.json.
// En cas d'échec (réseau, quota), le fichier existant est conservé et le build continue.
import { writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const USER = 'HULL-bit';
const OUT = 'content/github.json';
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'system-diaw-build' };
// jeton : GITHUB_TOKEN (CI) ou, en local, la session `gh auth login` si elle existe (évite la limite de 60 requêtes/h)
let token = process.env.GITHUB_TOKEN;
if (!token) { try { token = execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).toString().trim(); } catch { /* gh absent */ } }
if (token) headers.Authorization = `Bearer ${token}`;
const IGNORED = new Set(['Portfolio']);

const api = async (path) => {
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
};

try {
  const all = await api(`/users/${USER}/repos?per_page=100&sort=pushed`);
  // dépôts publics, hors forks, hors dépôts vides et hors ce portfolio
  const repos = all.filter((r) => !r.fork && !r.private && r.size > 0 && !IGNORED.has(r.name));
  // Langages : chaque dépôt pèse autant (part de chaque langage dans le dépôt), pour qu'un dépôt volumineux
  // (ex. un environnement virtuel versionné) ne fausse pas la répartition.
  const share = {};
  const bytesTotal = {};
  for (const r of repos) {
    const langs = await api(`/repos/${USER}/${r.name}/languages`);
    const sum = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
    for (const [k, v] of Object.entries(langs)) { share[k] = (share[k] ?? 0) + v / sum; bytesTotal[k] = (bytesTotal[k] ?? 0) + v; }
  }
  const languages = Object.entries(share)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, v]) => ({ name, bytes: bytesTotal[name], percent: Math.round((v / (repos.length || 1)) * 1000) / 10 }));

  // L'API publique n'expose pas le calendrier de contributions : on approxime avec les événements publics récents.
  const activity = {};
  try {
    for (const page of [1, 2, 3]) {
      const events = await api(`/users/${USER}/events/public?per_page=100&page=${page}`);
      if (!events.length) break;
      for (const e of events) {
        const day = e.created_at.slice(0, 10);
        activity[day] = (activity[day] ?? 0) + (e.type === 'PushEvent' ? (e.payload?.size ?? 1) : 1);
      }
    }
  } catch (e) {
    console.warn(`[github] activité indisponible (${e.message})`);
  }

  const data = {
    fetchedAt: new Date().toISOString(),
    user: USER,
    publicRepos: repos.length,
    stars: repos.reduce((n, r) => n + r.stargazers_count, 0),
    languages,
    repos: repos.slice(0, 8).map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      homepage: r.homepage || null,
      language: r.language,
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
    })),
    activity,
  };
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`[github] ${data.publicRepos} dépôts, ${languages.length} langages → ${OUT}`);
} catch (e) {
  console.warn(`[github] échec (${e.message}) — conservation de ${OUT}`);
  if (!existsSync(OUT)) {
    writeFileSync(
      OUT,
      JSON.stringify({ fetchedAt: null, user: USER, publicRepos: 0, stars: 0, languages: [], repos: [], activity: {} }, null, 2) + '\n',
    );
  }
}
