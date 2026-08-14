# TARGET — Premium v6 Astro Merge

This repository preserves the approved TARGET Premium v6 website as the visual and functional baseline while using Astro as the static build layer for Cloudflare Pages.

## Cloudflare Pages
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`

## Architecture
- `src/legacy/*.html` — approved Premium v6 page documents (preserved baseline)
- `src/pages/*.astro` — thin Astro build wrappers that emit the preserved documents
- `public/assets/` — approved v6 CSS/JS, logo assets and company data
- `public/images/` — visual enhancement assets used by the v6 design

This is an intentional progressive-Astro migration: preserve the approved interface first, then componentize in controlled future iterations without visual regression.
