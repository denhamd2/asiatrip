# Photo curation (TripAdvisor MCP + scripts)

## TripAdvisor MCP in Cursor (one-time curation)

1. Get a [TripAdvisor Content API key](https://www.tripadvisor.com/developers) (legacy Content API used by community MCPs).
2. Add to Cursor **Settings → MCP → Add server**:

```json
{
  "mcpServers": {
    "tripadvisor": {
      "command": "uvx",
      "args": ["tripadvisor-mcp"],
      "env": {
        "TRIPADVISOR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Alternative: clone [pab1it0/tripadvisor-mcp](https://github.com/pab1it0/tripadvisor-mcp) and point `command` at its Python entrypoint.

3. In Agent chat, ask to search each hotel/landmark and update `src/data/curatedImages.ts`, or run the script below.

### Useful MCP tools

- `search_locations` — `searchQuery: "Nora Buri Koh Samui"`, `category: "hotels"`
- `get_location_photos` — pass `locationId` from search
- `get_location_details` — disambiguate similar names

## Curation script (Node)

```bash
# Optional keys in .env.local or shell:
export TRIPADVISOR_API_KEY=...
export PEXELS_API_KEY=...

node scripts/curate-venue-images.mjs
```

Writes [`src/data/curatedImages.ts`](../src/data/curatedImages.ts). Priority: TripAdvisor → Pexels → Wikimedia Commons.

## Runtime API keys (Railway / local)

| Variable | Purpose |
|----------|---------|
| `VITE_PEXELS_API_KEY` | Pexels fallback in the browser (works client-side) |
| `VITE_TRIPADVISOR_API_KEY` | TripAdvisor fallback (often blocked by CORS in production — prefer curated map) |

Copy [`.env.example`](../.env.example) to `.env.local` for local dev.

TripAdvisor from the browser may require a same-origin proxy. In dev, Vite proxies `/api/tripadvisor/*` when `VITE_TRIPADVISOR_API_KEY` is set (see `vite.config.ts`).

## Image pipeline order

1. Curated map (`curatedImages.ts`)
2. Wikimedia (Wikipedia / Wikidata / Commons)
3. TripAdvisor Content API (if key + proxy)
4. Pexels (if key)
5. Placeholder icon
