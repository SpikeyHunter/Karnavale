# Karnavale — Festival de l'Halloween

Microsite (première ébauche) — SvelteKit + Svelte 5 + Tailwind v4 + GSAP + Lenis.
Structure identique à Produktworld, adaptée à la marque Karnavale.

## Commandes

```bash
cd ~/Karnavale
npm install
npm run dev        # → http://localhost:1600 (strictPort)
```

```bash
npm run check      # svelte-check
npm run build      # production build
npm run preview    # preview du build
```

## Assets à remplacer (placeholders générés depuis le flyer)

Dans `src/lib/assets/` — **écrase simplement les fichiers, mêmes noms** :

| Fichier                  | Statut                                             |
| ------------------------ | -------------------------------------------------- |
| `BG_KN.jpg`              | placeholder (flyer redimensionné) → ton vrai BG    |
| `BG_KN_Mobile.jpg`       | placeholder → ton vrai BG mobile                   |
| `BG_KN_Lineup.jpg`       | placeholder, pas encore utilisé (section lineup à venir) |
| `KN_Logo.png`            | wordmark extrait du flyer → ton vrai logo (+ `KN_Logo.svg` si tu veux) |
| `NCG_LOGO1_BLANC.png`    | extrait du flyer → ton vrai fichier                |
| `PRODUKT_Logo_White.png` | extrait du flyer → ton vrai fichier                |

Dans `static/fonts/` — **à déposer (pas inclus)** :

- `VictorSerif-70Bold.woff2`
- `VictorSerif-70Bold.woff`

(Sans les fontes, le site retombe sur Georgia — aucun crash.)

Favicons dans `static/` : générés depuis le flyer (visage), remplace-les quand
tu as les vrais.

## Ce qui a changé vs Produktworld

- **Palette** (`src/app.css` → `@theme`) : beige `#FFFDD9`, lightorange
  `#FDA719`, darkorange `#C03700`, purpleaccent `#8B4A9E`, darkaccent
  `#1A0E24` (aubergine profond tiré des ombres du poster — garde le hex de
  `src/app.html` synchronisé si tu le changes).
- **Preloader** : vortex/étoile retiré — fondu simple : logo sur fond sombre →
  BG en crossfade → logo glisse vers `#page-logo`. Le handoff pixel-perfect
  vers la page est conservé. Prêt à recevoir la nouvelle animation.
- **Pas de section Lineup** : `HomeContent` = hero (Signup) + Footer. Le
  scroll-morph du BG lineup a été retiré avec la section (réf. dans le
  HomeContent de Produktworld quand on la remet).
- **Signup** : le formulaire Laylo (prévente) est **toujours visible** — plus
  de bouton de reveal. DropId `89cc724f-…`. Paramètres ajustés pour le thème :
  `color=FDA719&theme=dark` (ton embed d'origine était `FFEA2C`/`light` —
  remets-les dans `Signup.svelte` → `LAYLO_SRC` si tu préfères).
- **gsap.ts** : seulement core + ScrollTrigger. Les plugins premium
  (SplitText, DrawSVG, ScrambleText) ne sont pas requis pour cette ébauche —
  copie ton dossier `src/lib/gsap-bonus/` de Produktworld et décommente dans
  `gsap.ts` quand on fera l'animation.
- **Info.svelte** : version simplifiée (sans SplitText), cachée par défaut
  (`INFO_SECTION_VISIBILITY = 'off'` dans `src/lib/config.ts`).
- **Header.svelte** : présent dans `components/` mais non monté (comme PW —
  le wordmark du hero sert de masthead).
- **Port** : 1600 (`vite.config.ts`, strictPort).
