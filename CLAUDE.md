# CLAUDE.md — Portfolio « SYSTEM//DIAW » (Souleymane DIAW)

Site 100 % statique, bilingue FR/EN, visé Awwwards SOTD. Deux publics : le recruteur pressé (essentiel en 10 s, CV en 1 clic) et le profil technique (qualité d'exécution). Règle d'or : **explosif ET professionnel ET statique**. Un effet qui ralentit, cache une info ou fait gadget est un bug.

Ce fichier est relu à chaque étape. Le prompt complet fait foi pour les détails ; ici, les règles qui ne se négocient pas.

## Contraintes statiques (absolues)
- `next.config.ts` : `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`, `basePath` / `assetPrefix` depuis `NEXT_PUBLIC_BASE_PATH`, `reactStrictMode: true`.
- **Interdit** : `app/api/*`, Server Actions (`'use server'`), `middleware.ts`, `cookies()`, `headers()`, `draftMode()`, `revalidate`, `force-dynamic`, `getServerSideProps`, base de données, backend, `next/image` optimisé, `next/font/google`.
- **Autorisé** : `generateStaticParams` ; `sitemap.ts` / `robots.ts` / `manifest.ts` avec `export const dynamic = 'force-static'` ; appels navigateur vers Web3Forms et GoatCounter uniquement ; API GitHub **au build seulement** (`prebuild`).
- Tout chemin d'asset passe par le `basePath` (helper `withBase()` dans `src/lib`). Jamais de `/…` absolu en dur.
- `scripts/check-static.mjs` (`postbuild`) fait échouer le build : motifs interdits dans `src/`, pages attendues dans `out/` (`index`, `fr`, `en`, `404`, chaque `[lang]/projets/[slug]`), chemins absolus sans basePath dans le HTML.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript `strict` · Tailwind v4 + variables CSS · three / @react-three/fiber / drei / postprocessing · GSAP 3.13+ (ScrollTrigger, SplitText, ScrambleText, DrawSVG, MorphSVG) · Lenis · Framer Motion (transitions de page, layout) · GLSL maison · Zod (contenus validés au build) · sharp (images, portrait) · ESLint, Prettier, Playwright, Lighthouse CI.
Polices auto-hébergées `woff2` dans `public/fonts` : Clash Display Bold (titres, 600→700), Satoshi Regular/Medium (texte), JetBrains Mono 400 (code, 400→500). `font-display: swap`, préchargement des 3 fichiers critiques, **polices de secours à métriques ajustées** (`scripts/font-metrics.mjs`, `FontFaces.tsx`) pour un CLS nul.

## Design tokens (`src/styles/globals.css`)
```
--bg #05060A  --bg-2 #0A0D18  --surface rgba(20,26,48,.55)  --line rgba(61,90,254,.22)
--indigo #3D5AFE  --violet #7C3AED  --gold #FFB800  --cyan #00E5FF  --magenta #FF2E88
--text #F5F7FF  --muted #7D8597  --radius 18px
--ease-out-expo cubic-bezier(.16,1,.3,1)  --ease-in-out-quart cubic-bezier(.76,0,.24,1)
```
Mode jour : fond #F3F1EA, texte #0A0D18, mêmes accents.
- **Or réservé** aux chiffres et aux appels à l'action. Rareté = impact.
- Titres de section : Clash Display 700, `clamp(4rem,14vw,16rem)`, line-height .85, tracking -.04em, débordent volontairement.
- Sur-titres : JetBrains Mono 12–14 px, majuscules, `0.2em`, préfixe `// 03 — PROJETS`.
- Texte : Satoshi 400/500, 17–19 px, 65 caractères max. Grille 12 colonnes. Contraste AA partout.
- **Interdits visuels** : templates, cartes blanches en 3 colonnes, icônes génériques colorées, emojis, dégradés arc-en-ciel, drapeau, baobab, carte de l'Afrique, photos de banque d'images, Lorem ipsum.

## Motion
- Tout dans `src/lib/motion.ts` (durées, easings). Entrées `expo.out`, transitions `power4.inOut`, jamais `linear` hors boucles.
- Micro 200–350 ms · révélations 700–1100 ms · transitions de page 900–1200 ms.
- Un seul grand moment par écran. Ce qui bouge au scroll est lié au scroll (`scrub`), sauf révélations de texte.
- Les « grands moments » sont **Hero, Projets, Compétences**. Le reste est sobre.
- `prefers-reduced-motion` : pas de boot, pas de particules, pas de pin horizontal, fondu simple.

## Performance et accessibilité
- Lighthouse ≥ 90 × 4 (desktop + mobile), LCP < 2,5 s, CLS < 0,05, INP < 200 ms. JS initial < 200 Ko gzip hors chunks 3D.
- 3D en import dynamique (`requestIdleCallback` ou IntersectionObserver, marge 50 %). `gpu-tier.ts` : `high` / `mid` / `low`. Canvas en pause hors écran et onglet caché, `dpr` ≤ 1.75.
- Le premier écran (nom, titre, disponibilité, 3 preuves, boutons CV/Contact) est en **HTML**, visible < 600 ms, avant toute 3D. Le boot est une surcouche : le contenu existe dès le départ.
- WCAG 2.1 AA : clavier partout, focus cyan visible, `aria-label` sur canvas, équivalent HTML de chaque scène 3D, lien « Aller au contenu », `lang` correct.
- Aucune info utile au recruteur cachée derrière hover / clic / terminal.

## Contenu et ton
- **Ne jamais inventer de faits.** Ce qui manque devient `TODO: confirmer` (listé en fin de README).
- Vouvoiement, phrases courtes, verbes d'action, chiffres concrets, pas d'humour (sauf terminal). Études de cas : Contexte → Mission → Actions → Résultats, 3 résultats chiffrés max.
- Textes FR/EN depuis `content/i18n/*.json` et champs `{fr,en}`. Pas de texte non traduit.
- Pas de son. Pas de backend « pour plus tard ». Pas de bibliothèque de composants à look de template.
- Mots-clés SEO/ATS intégrés naturellement : Administrateur Linux, DBA Oracle, PL/SQL, Django, React, Spring Boot, Full-Stack, Dakar, Sénégal…

## Architecture (décisions à respecter)
- **Tout est rendu côté serveur** ; le JS n'ajoute que des couches. Pour les gros blocs (section Projets, boot, bandeaux), préférer du HTML serveur + un **îlot client minuscule** qui rend `null` (ex. `ProjectsFilter`, `LiquidBehavior`) plutôt qu'un gros arbre client à hydrater. Jamais de `<a>` dans un `<a>` (erreur d'hydratation #418).
- Révélations = CSS + IntersectionObserver (classe `.in`) ; GSAP seulement pour SplitText (chargé à l'approche), Lenis, DrawSVG. Titres masqués par `opacity` (jamais `visibility`). Moteur d'animation différé (`src/lib/defer.ts`).
- Nom du héros dimensionné en `cqw` (colonne), pas en `vw`. Mots des titres géants insécables (`.split-word`). Tester 390→2560 px (`npm run smoke` vérifie les débordements).
- Aucun effet de mise en page dans les animations (scramble du nom sur une couche superposée).
- GPU : rendu logiciel = tier `low` (pas de WebGL). Forçage : `?gpu=force` ou commande terminal `gpu on`.
- Projets : `content/projects.json` (statut, `technical[]`, liens, `images`/`imageKind`) ; captures dans `content-images/<slug>/`. Les projets sans capture utilisent un visuel schématique SVG, étiqueté comme tel.
- Contenu sensible : ne jamais utiliser les photos de personnes des dépôts clients (ex. `docs/imgs` du dépôt DGAP) ; signaler les dépôts publics exposant des données (voir TODO « CONFIDENTIALITÉ »).

## Arborescence
`content/` (JSON + i18n) · `content-images/` (captures sources) · `public/{cv,images,fonts,data,og}` · `scripts/` (fetch-github, optimize-images, sample-portrait, generate-og, check-static, smoke, audit-a11y, shots, serve, font-metrics, capture-project-shots, list-todos) · `src/app/[lang]/…` · `src/components/…` · `src/lib` · `src/shaders` · `deploy/nginx.conf` · `.github/workflows/deploy.yml` · `lighthouserc.*.json`.

## Commandes
```
npm run dev | build | preview | lint
npm run smoke      # tests de fumée Playwright (BASE_PATH=/x sous un basePath)
npm run a11y       # axe-core, thèmes sombre et clair
npm run shots      # captures dans .screenshots/ (--width, --only, --at)
npm run todos      # liste des TODO: confirmer
npm run lhci:desktop | lhci:mobile
```
Test sous basePath : `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build && BASE_PATH=/portfolio npm run smoke`.

## Statut
Les 10 étapes sont réalisées. Avant tout commit : `npm run lint`, `npm run build`, `npm run smoke`. Reste : TODO de contenu (README) et décisions de confidentialité sur les dépôts publics.
