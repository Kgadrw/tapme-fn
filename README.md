# tapme-fn

Frontend for [tapme](https://github.com/Kgadrw/tapme-fn) — digital profile app (marketing site, user dashboard, public profiles).

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

- Marketing: `http://localhost:8080`
- User dashboard: `http://profile.localhost:8080`

The dev server proxies `/api/*` to the backend (run the API separately).

## Build

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_API_URL` — API base URL (optional in dev; Vite proxies to `localhost:3001`)
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID
