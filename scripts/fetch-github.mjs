// Récupère les données GitHub publiques AU BUILD uniquement → content/github.json.
// En cas d'échec (réseau, quota), le fichier existant est conservé et le build continue.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const USER = 'HULL-bit';
const OUT = 'content/github.json';
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'system-diaw-build' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const api = async (path) => {
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
};

try {
  const all = await api(`/users/${USER}/repos?per_page=100&sort=pushed`);
  const repos = all.filter((r) => !r.fork && !r.private);
  const langTotals = {};
  for (const r of repos) {
    const langs = await api(`/repos/${USER}/${r.name}/languages`);
    for (const [k, v] of Object.entries(langs)) langTotals[k] = (langTotals[k] ?? 0) + v;
  }
  const total = Object.values(langTotals).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, bytes]) => ({ name, bytes, percent: Math.round((bytes / total) * 1000) / 10 }));

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
