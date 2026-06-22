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

No environment variables are required; Railway sets `PORT` automatically.

### After setup

Every push to `main` triggers an automatic redeploy.
