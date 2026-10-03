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
Polices auto-hébergées `woff2` dans `public/fonts` : Clash Display (titres), Satoshi (texte), JetBrains Mono (code). `font-display: swap`, préchargement des 2 graisses critiques.

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

## Arborescence
`content/` (JSON + i18n) · `public/{cv,images,fonts,data,og}` · `scripts/` (fetch-github, optimize-images, sample-portrait, generate-og, check-static) · `src/app/[lang]/…` · `src/components/{boot,hero,about,marquee,experience,projects,skills,journey,github,contact,three,terminal,cursor,transitions,nav,ui}` · `src/lib` · `src/shaders` · `deploy/nginx.conf` · `.github/workflows/deploy.yml`.

## Commandes (à créer dans `package.json`)
```
npm run dev        # next dev
npm run build      # prebuild (github, images, portrait, og) → next build → postbuild (check-static)
npm run preview    # npx serve out
npm run lint
npm run shots      # Playwright : .screenshots/ desktop 1440 + mobile 390
```
Test sous basePath : `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`.

## Méthode (10 étapes, 1 commit chacune `feat(zone): …`)
1 init/static/tokens/polices · 2 contenus + Zod + i18n + prebuild · 3 layout + sections HTML/CSS sans animation · 4 motif brodé, logo, grain, fond shader · 5 motion (Lenis, GSAP, compteurs, bandeaux, curseur) · 6 Hero particules + replis + boot · 7 projets horizontaux + pages projet + transitions · 8 baie 3D, fil du parcours, GitHub, contact · 9 vue express CV + print, barre mobile, terminal, easter egg, mode clair, mesure · 10 audit final.
À chaque étape : `npm run build` sans erreur/avertissement TS, `preview`, captures Playwright regardées, correction si pas au niveau. **On ne passe pas à l'étape suivante si le build casse ou si les captures déçoivent.**

## État du dépôt au démarrage
- Ancien projet Replit supprimé dans l'arbre de travail (`artifacts/`, `.replit`…), non committé : repartir d'une base propre.
- Sources fournies : `profil/profil.jpeg`, `cv/*.pdf` (7 versions, à trancher), à déplacer/copier vers `public/` par script.
