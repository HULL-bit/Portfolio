# SYSTEM//DIAW — Portfolio de Souleymane DIAW

Site **100 % statique** (Next.js 15 en `output: 'export'`), bilingue FR/EN, servable par n'importe quel serveur de fichiers (GitHub Pages, Nginx, `npx serve out`). Aucun serveur Node en production.

- Premier écran en HTML pur (nom, titre, disponibilité, 3 preuves chiffrées, CV, contact), avant toute 3D.
- Trois grands moments : le **Hero** (portrait illustré façon bande dessinée, boot), les **Projets**, les **Compétences** (baie de serveurs 3D). Le reste est sobre.
- Vue express recruteur `/fr/cv/` : CV d'une page en HTML pur, imprimable (A4).
- Thèmes sombre (par défaut) et clair, terminal intégré (touche `` ` ``), aucun WebGL hors baie 3D des compétences (fond en images WebP, rapide partout).

## Installation

Prérequis : Node.js 20+ et npm.

```bash
npm ci
npx playwright install chromium   # génération des images Open Graph, captures et tests
cp .env.example .env.local        # puis renseigner les variables (toutes facultatives)
```

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Clé publique [Web3Forms](https://web3forms.com) du formulaire de contact. Absente : repli `mailto:`. |
| `NEXT_PUBLIC_BASE_PATH` | Sous-dossier de déploiement (GitHub Pages : `/nom-du-depot`). Vide à la racine d'un domaine. |
| `NEXT_PUBLIC_SITE_URL` | URL publique (canonical, sitemap, Open Graph). Par défaut : `https://www.souleymane-diaw.online`. |
| `NEXT_PUBLIC_GOATCOUNTER` | Code [GoatCounter](https://www.goatcounter.com) (statistiques sans cookie). Absent : désactivé. |
| `GITHUB_TOKEN` | Facultatif au build : évite la limite de l'API GitHub (en local, la session `gh auth login` est utilisée). |

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement. |
| `npm run build` | `prebuild` (données GitHub, portrait illustré, images AVIF/WebP/JPEG, fonds nébuleuse, images OG) → `next build` → `postbuild` (`check-static`). |
| `npm run preview` | Sert `out/` sur http://localhost:4010 (`--base /sous-dossier` pour simuler GitHub Pages). |
| `npm run lint` | ESLint. |
| `npm run smoke` | Tests de fumée Playwright (pages, filtres, terminal, thème, formulaire, 404, mobile, débordements 390→2560 px). `BASE_PATH=/portfolio npm run smoke` sous un basePath. |
| `npm run a11y` | Audit axe-core (WCAG 2.1 A/AA) en thème sombre et clair. |
| `npm run shots` | Captures Playwright dans `.screenshots/` (`--only=desktop`, `--width=1920`, `--at=#projects@300`…). |
| `npm run lhci:desktop` / `lhci:mobile` | Lighthouse CI (nécessite `CHROME_PATH` ou Chrome installé). |
| `npm run todos` | Liste Markdown de tous les `TODO: confirmer` restants. |

`check-static` (lancé en `postbuild`) fait échouer le build si le code contient `'use server'`, `cookies(`, `headers(`, `app/api`, `middleware`, `force-dynamic`, `getServerSideProps`, si une page attendue manque dans `out/`, ou si un HTML contient un chemin absolu sans `basePath`.

Test sous un basePath : `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build && BASE_PATH=/portfolio npm run smoke`.

## Modifier le contenu

Tout le contenu est dans `content/` (JSON validé par Zod à chaque build : une erreur de contenu ou une clé de traduction manquante **casse le build**).

| Je veux modifier… | Fichier |
|---|---|
| Identité, contact, disponibilité, chiffres clés, bandeau de confiance, langues | `content/profile.json` |
| Un **projet** (texte, réalisation technique, stack, résultats, liens, statut) | `content/projects.json` |
| Les captures d'un projet | déposer `content-images/<slug>/home.jpg` (ou `.png`) puis ajouter `"images": ["home"]` au projet (`imageKind` : `web`, `mobile` ou `diagram`) ; `npm run build` génère AVIF/WebP/JPEG |
| Expérience, parcours, cursus, compétences | `experience.json`, `education.json`, `curriculum.json`, `skills.json` |
| Recommandations, certifications (section masquée si vide) | `testimonials.json`, `certifications.json` |
| Un **texte** d'interface | `content/i18n/fr.json` et `en.json` (mêmes clés des deux côtés) |
| Les commandes et réponses du terminal | `content/terminal.json` |
| Le **CV** | remplacer `public/cv/CV-Souleymane-DIAW-FR.pdf` / `-EN.pdf` ; la vue express `/fr/cv/` se génère depuis les JSON |
| La photo | `profil/profil.jpeg` ; le portrait illustré du Hero (`profil/hero-cartoon.png`) en est généré par `scripts/cartoonize-portrait.mjs` (aplats, traits d'encre, fond aux couleurs du site ; `--k=8` règle le nombre d'aplats) |

Les captures des sites en production se rafraîchissent avec `node scripts/capture-project-shots.mjs [slug…]` (réseau requis).

### Données GitHub

`scripts/fetch-github.mjs` interroge l'API publique **au build uniquement** et écrit `content/github.json` (en cas d'échec, le fichier existant est conservé). Le workflow GitHub reconstruit le site chaque nuit à 02:00 UTC pour le garder à jour.

### Qualité graphique (3D)

`src/lib/gpu-tier.ts` classe l'appareil (`high`, `mid`, `low`). Seule la baie de serveurs 3D (Compétences) utilise WebGL ; un **rendu logiciel** (SwiftShader, llvmpipe — fréquent sous Linux sans accélération matérielle) la coupe volontairement et le site retombe sur son repli HTML/CSS. Le fond (nébuleuse teintée selon la section) et le portrait sont des images : identiques sur mobile et desktop, sans coût GPU. `scripts/generate-bg.mjs` régénère les fonds ; `node scripts/perf-scroll.mjs [--gpu=force|low]` mesure la fluidité du défilement. Pour forcer la 3D : ouvrir `?gpu=force`, ou taper `gpu on` dans le terminal (`gpu` affiche le moteur détecté ; `gpu auto` revient au mode automatique).

## Déploiement

### GitHub Pages

1. Dépôt GitHub → **Settings → Pages → Source : GitHub Actions**.
2. Facultatif — *Settings → Secrets and variables → Actions* : secret `WEB3FORMS_KEY` ; variables `SITE_URL` (par défaut `https://www.souleymane-diaw.online`), `GOATCOUNTER_CODE`, et `USE_CUSTOM_DOMAIN=false` pour tester sur l'URL « projet » `hull-bit.github.io/<dépôt>` (le `basePath` vaut alors `/<nom-du-dépôt>` ; par défaut le site est à la racine du domaine).
3. **Domaine** : *Settings → Pages → Custom domain* = `www.souleymane-diaw.online`, puis chez le registrar : `CNAME www → hull-bit.github.io` et, pour l'apex, quatre enregistrements `A` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` ; cocher « Enforce HTTPS » une fois le certificat émis. Tant que le DNS n'existe pas, le domaine ne répond pas (au 6 octobre 2026, le registre `.online` renvoie NXDOMAIN).
3. Pousser sur `main` : `.github/workflows/deploy.yml` fait `npm ci`, lint, build, tests de fumée, audit axe, Lighthouse CI (desktop : échec sous 85), puis déploie avec `actions/deploy-pages`. Il se relance chaque nuit à 02:00 UTC.

### VPS Ubuntu (Nginx)

```bash
npm ci && npm run build                      # build sans NEXT_PUBLIC_BASE_PATH (site à la racine du domaine)
sudo apt install nginx libnginx-mod-http-brotli-filter libnginx-mod-http-brotli-static certbot python3-certbot-nginx
sudo mkdir -p /var/www/diaw && sudo rsync -a --delete out/ /var/www/diaw/
sudo cp deploy/nginx.conf /etc/nginx/sites-available/diaw     # remplacer « exemple.com » par le domaine (déjà fait : `souleymane-diaw.online`)
sudo ln -s /etc/nginx/sites-available/diaw /etc/nginx/sites-enabled/
sudo certbot --nginx -d souleymane-diaw.online -d www.souleymane-diaw.online        # HTTPS Let's Encrypt + renouvellement automatique
sudo nginx -t && sudo systemctl reload nginx
```

`deploy/nginx.conf` : HTTP/2, brotli + gzip, cache 1 an pour `/_next/static`, HSTS, CSP (seules origines tierces : `api.web3forms.com` et GoatCounter), `try_files $uri $uri/ $uri.html =404`, page 404 « kernel panic ». La CSP garde `'unsafe-inline'` pour les scripts : un export statique Next.js embarque ses données d'hydratation dans des `<script>` inline.

## Architecture en bref

- `src/app/[lang]/(site)/…` : accueil et pages projet ; `src/app/[lang]/cv/` : vue express ; `src/app/(root)/` : redirection `/` → `/fr/` ou `/en/`.
- **Tout est rendu côté serveur (HTML statique)** ; le JavaScript n'ajoute que des couches (animations, 3D, terminal). Les parties lourdes (section Projets, boot, bandeaux) sont du HTML pur avec de minuscules « îlots » client (filtres, survol liquide) : rien de volumineux à hydrater.
- Moteur d'animation (Lenis, GSAP) différé jusqu'à la première interaction ou ~1,2 s après le chargement ; 3D en import dynamique, jamais chargée sur un appareil `low`.
- `prefers-reduced-motion` : ni boot, ni dérive du fond, ni transitions animées.
- Polices de secours à métriques ajustées (`scripts/font-metrics.mjs`) : aucun décalage de mise en page au chargement des polices.

## Mesures (Lighthouse, build de production servi en local)

| | Perf. | Access. | Bonnes prat. | SEO |
|---|---|---|---|---|
| Desktop | 99 | 100 | 100 | 100 |
| Mobile (simulation 4× CPU, 4G lente) | 77–88 | 100 | 100 | 100 |

CLS 0 et TBT ≈ 200–300 ms sur mobile. La note mobile varie selon la machine (la simulation s'appuie sur une trace réelle) ; un rendu logiciel, comme sur la CI GitHub, désactive la 3D.

## Points d'attention avant publication

- **Dépôts publics liés** : plusieurs dépôts GitHub liés depuis le portfolio contiennent des fichiers sensibles (voir les TODO « CONFIDENTIALITÉ » ci-dessous : comptes de test et base SQLite, photos de membres, cahiers des charges clients). À nettoyer ou à passer en privé avant de publier le site.
- Les images `docs/imgs` du dépôt DGAP sont des photos institutionnelles de personnels : elles ne sont **pas** utilisées.

## TODO restants

Générés par `npm run todos` (à relancer après chaque modification des contenus).

### Profil
- [ ] Chiffres clés : « 600+ utilisateurs », « 3 ans » et « 25+ technologies » à confirmer (« 4+ projets en production » est appuyé par 4 sites en ligne : Blue Track, O'Crystal, site Wagadu, Daara)
- [ ] CV EN : copie du CV FR en attendant une version anglaise
- [ ] Autorisation d'utiliser les noms des organisations du bandeau « Ils m'ont fait confiance » (dont O'Crystal)

### Cursus
- [ ] Cursus : intitulés exacts des unités d'enseignement et répartition par année (Licence, Master 1, Master 2) à confirmer
- [ ] Cursus : la mention « et d'autres » (langages, frameworks) attend la liste complète

### Compétences
- [ ] Niveaux (1 à 5) des barres de LED : indicatifs, à confirmer

### Expérience
- [ ] ONG Wagadu Africa : Confirmer le détail des missions et la ville exacte du poste
- [ ] ONG Wagadu Africa : Wagadu Hub et le site de l'ONG : confirmer le périmètre de votre rôle

### Projet « BLUE TRACK — suivi des pirogues »
- [ ] Préciser ce que mesure −40 % (incidents ? risques ?)
- [ ] Nombre de pirogues suivies (50+ ou 200+)
- [ ] Application mobile Flutter citée dans le brief initial : à confirmer
- [ ] Le code de production est dans un dépôt privé : seul le prototype public est lié

### Projet « O'Crystal — site de marque et espace pro »
- [ ] CONFIDENTIALITÉ : le dépôt public contient docs/brand-source/Cahier_des_charges_OCrystal.docx — vérifier que ce document client peut être public
- [ ] Confirmer le rôle exact et l'année
- [ ] Autorisation d'afficher la marque et la capture d'O'Crystal

### Projet « Wagadu Hub — portail interne de l'ONG »
- [ ] Chiffres de tests à actualiser (issus de docs/roadmap.md)
- [ ] Le dépôt public contient le cahier des charges de l'ONG : vérifier qu'il peut rester public
- [ ] Capture limitée à la page d'accueil publique du Hub (les écrans internes, à accès restreint, ne sont pas montrés) : autorisation de l'ONG d'afficher cette capture à confirmer

### Projet « Site de l'ONG Wagadu Africa »
- [ ] Confirmer l'année et le périmètre exact (réalisation vs administration)
- [ ] Autorisation de l'ONG d'afficher la capture de l'accueil (version anglaise, sans visage)

### Projet « Daara Barakatul Mahaahidi — plateforme de gestion »
- [ ] CONFIDENTIALITÉ : le dépôt public DBM contient des photos de membres (backend/media/photos_membres) — données personnelles à retirer de l'historique ou dépôt à passer en privé avant de le lier
- [ ] Nombre d'utilisateurs (100+ ou 500+)
- [ ] Autorisation d'afficher la capture de la daara

### Projet « DGAP Sénégal — portail et socle SI »
- [ ] CONFIDENTIALITÉ : le dépôt public DGAP contient files/Cahier des charges DGAP.docx et docs/imgs (photos institutionnelles de personnels de l'administration pénitentiaire) — à passer en privé ; ces photos ne sont PAS utilisées dans le portfolio
- [ ] Le brief initial citait Spring et Oracle : à confirmer (le dépôt montre Django, React, PostgreSQL)
- [ ] Volumes (candidats, inscriptions) à renseigner après déploiement
- [ ] Autorisation de la DGAP / du Ministère de la Justice d'afficher les captures de l'accueil et de l'intranet (application non déployée ; la capture d'intranet montre un compte de démonstration)

### Projet « G-SERVICES — services et produits géolocalisés »
- [ ] Préciser le cadre (projet personnel, académique ?) et le client éventuel

### Projet « BAAXIL-XADIIM — plateforme Ahibahil Khadim »
- [ ] CONFIDENTIALITÉ : le dépôt public BAAXIL-XADIIM contient des photos de membres (backend/media/photos_membres) et des images WhatsApp — à retirer de l'historique ou dépôt à passer en privé
- [ ] Le service Render répond actuellement « Service Suspended » : le réactiver (ou retirer le lien)
- [ ] Autorisation d'afficher la capture de la plateforme Ahibahil Khadim (tableau de bord d'administration)

### Projet « DeliverEat — livraison de repas à Dakar »
- [ ] Préciser le cadre (projet académique ? client ?)

### Projet « Multi-Market — mémoire de Licence »
- [ ] CONFIDENTIALITÉ : le dépôt public Ocass-Digital contient MOTS_DE_PASSE.md (comptes de test) et backend/db.sqlite3 — à retirer de l'historique ou passer le dépôt en privé avant de le lier depuis le portfolio
- [ ] Confirmer que ce dépôt correspond au mémoire (le brief initial citait Spring, Flutter et MySQL)
- [ ] Valider « 5 points de vente » et « −60 % de ruptures »

