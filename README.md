# asiatrip

Family Asia holiday itinerary dashboard (June–July 2026).

Repository: [github.com/denhamd2/asiatrip](https://github.com/denhamd2/asiatrip)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Production build

```bash
npm run build
npm start
```

## Deploy to Railway

This app is configured for [Railway](https://railway.app) via [`railway.toml`](railway.toml) (`npm run build` → `npm start`).

### First-time setup (one per project)

1. Push this repo to GitHub (`main` branch).
2. In [Railway](https://railway.app), click **New Project** → **Deploy from GitHub repo**.
3. Select **`denhamd2/asiatrip`** (creates a **new** project — does not affect your other Railway apps).
4. Wait for the deploy to finish (green **Active** status).
5. Open the **asiatrip** service → **Settings** → **Networking** → **Generate Domain** (fixes **Unexposed service** — without this there is no public URL).
6. Confirm **Settings → Source** uses branch `main` with deploy-on-push enabled.

No environment variables are required for basic deploy; Railway sets `PORT` automatically.

Optional photo API keys (see [docs/PHOTO-CURATION.md](docs/PHOTO-CURATION.md) and [`.env.example`](.env.example)):

- `VITE_PEXELS_API_KEY` — Pexels fallback for landmarks/hotels not on Wikimedia
- `VITE_TRIPADVISOR_API_KEY` — TripAdvisor fallback (dev proxy via Vite; prefer curated map in production)

Regenerate curated venue photos: `node scripts/curate-venue-images.mjs`

Railpack detects this Vite app and serves the `dist/` folder via its built-in static server (Caddy). Do **not** set a custom start command — that disables SPA mode and can leave the service offline.

Optional: `RAILPACK_NODE_VERSION=22` if the build log shows an older Node version (Vite 8 needs Node 20.19+).

### After setup

Every push to `main` triggers an automatic redeploy.
