# CorSuplementos — Frontend

Angular single-page app for the CorSuplementos store: catalogue, cart, checkout
and order history.

Deployed on Vercel at `https://frontend-corsuplementos.vercel.app`. It talks to
the Django API in a separate repository.

## Requirements

- Node.js 20+ (bun is the package manager: `bun.lock` and
  `packageManager: bun@1.3.1` in `package.json`)
- The backend running locally on `http://localhost:8000`

## Running locally

```bash
bun install
bun start          # ng serve on http://localhost:4200
```

The development environment points at `http://localhost:8000/api`
(`src/environments/environment.ts`). Start the backend first: without it the
catalogue is empty and checkout cannot reserve stock.

## Scripts

| Command | What it does |
| --- | --- |
| `bun start` | Development server with live reload |
| `bun run build` | Production build into `dist/frontend/browser` |
| `bun run test` | Vitest in watch mode |
| `bun run test:ci` | Vitest, single run |

## Environments

Two files, one job each:

- `src/environments/environment.ts` — development, `apiUrl` on localhost.
- `src/environments/environment.production.ts` — the deployed API URL.

`angular.json` swaps them through `fileReplacements`, so the production bundle
never carries a localhost URL. If the backend domain changes, edit
`environment.production.ts`, rebuild and redeploy.

## Structure

```
src/app/
├── domains/
│   ├── auth/       login, register, JWT interceptor, guard
│   ├── products/   catalogue and product detail
│   ├── cart/       cart state and cart page
│   └── checkout/   checkout form, confirmation, order history
└── shared/
    ├── components/ header, footer, price display, field error, 404
    ├── services/   cross-domain helpers
    └── utils/      API error flattening
```

Each domain owns its models, services and feature components. Components are
standalone and load lazily through the route table.

## Routing

`src/app/app.routes.ts` declares the public routes, the authenticated routes
behind `authGuard`, and a final `**` wildcard that renders the 404 page.

The wildcard must stay last. Angular matches routes in order, so a wildcard
placed earlier swallows every route declared after it. `app.routes.spec.ts`
navigates to an unknown URL to prove the fallback is reachable and is not
blocked by the auth guard.

## Styling

SCSS with a design-token layer in `src/styles/_variables.scss`: colours,
typography, spacing, radii and breakpoints. Components import it with
`@use 'variables' as *;` and should not hardcode values that already exist
there.

## Testing

```bash
bun run test:ci
```

16 tests across 6 files: the app shell, the checkout amount rule (shipping is
never charged online), the order service, error flattening, the 404 page and
the wildcard route.

## Deployment — Vercel

`vercel.json` holds the whole configuration:

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist/frontend/browser",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The rewrite is not optional. This is a client-side routed SPA: without it,
reloading `/my-orders` asks the static host for a file with that name and gets
a 404, because Angular resolves the route in the browser.

After deploying, the backend must list the new origin in `CORS_ALLOWED_ORIGINS`
and `FRONTEND_URL`, without a trailing slash.
