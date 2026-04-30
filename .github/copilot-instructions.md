# Budget Buddy — AI Agent Instructions

**Budget Buddy** is a personal finance management SPA with budgeting, goal tracking, Islamic financial tools (Zakat), stock market tracking, and educational content.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript 5.8, Vite |
| Routing | React Router 7 (`createBrowserRouter`) |
| State | Zustand 5 |
| Styling | Tailwind CSS 3 (class-based dark mode, RTL-aware) |
| UI Primitives | Radix UI, `components/ui/` wrappers |
| Charts | Recharts |
| Animation | Framer Motion, GSAP |
| Forms | React Hook Form + Zod |
| i18n | i18next (Arabic default + English, full RTL) |
| Backend | Node.js/Express + MongoDB/Mongoose (`server/`) |
| Auth | JWT stored in `localStorage` as `bb_auth_token` |
| DB client | MongoDB Atlas Realm Web SDK (`src/lib/realm.ts`) |

## Commands

```bash
# Frontend
npm run dev        # Vite dev server (proxies /api → localhost:3001)
npm run build      # tsc -b && vite build
npm run lint       # ESLint

# Backend (server/)
npm run dev        # nodemon index.js
npm start          # node index.js
```

## Environment

Copy `.env.example` to `.env.local` and fill in:
- `VITE_REALM_APP_ID` — MongoDB Atlas App Services ID

## Project Structure

```
src/
├── app/          # App.tsx (RTL/dark mode setup), router.tsx, layout.tsx
├── pages/        # One file per route (DashboardPage.tsx, etc.)
├── components/   # Feature folders + shared/ + ui/
├── store/        # Zustand stores (one per feature)
├── hooks/        # Custom React hooks
├── lib/          # Utilities, realm.ts, categories.ts, zakat.ts
├── types/        # Shared TypeScript types (index.ts, markets.ts)
├── constants/    # Static data
└── i18n/         # ar.json (default), en.json
api/              # Vercel serverless functions (auth endpoints)
server/           # Express server for local dev
```

## Key Conventions

### State Management
- Every feature has its own Zustand store in `src/store/`.
- Stores define an interface (`FeatureState`) with state fields and async action methods.
- API calls inside stores use the shared `apiFetch()` helper (defined in `authStore.ts`) which auto-attaches the JWT.
- Stores expose `isLoading` and `error` fields.

### Routing & Auth
- All authenticated routes are wrapped in `ProtectedRoute` ([src/components/shared/ProtectedRoute.tsx](../src/components/shared/ProtectedRoute.tsx)).
- Route tree: `LandingPage` (public `/`) → `ProtectedRoute` → `OnboardingPage` OR `Layout` (sidebar shell) → feature pages.
- New routes are added to [`src/app/router.tsx`](../src/app/router.tsx) inside the `ProtectedRoute` > `Layout` children.

### Styling
- Use Tailwind utility classes exclusively. Custom colors are in [`tailwind.config.ts`](../tailwind.config.ts): `primary`, `neutral`, `gold`, `success`, `danger`, `info`.
- Dark mode via `dark:` prefix — toggled by adding `dark` class to `<html>`.
- RTL: `dir="rtl"` is set on `<html>` when language is Arabic. Use `rtl:` Tailwind variants and `start`/`end` logical properties instead of `left`/`right` for RTL-safe layouts.
- Font families: `font-display` (Plus Jakarta Sans), `font-arabic` (Noto Sans Arabic), `font-mono` (JetBrains Mono).

### Internationalization
- All UI strings go through `useTranslation()` from `react-i18next`.
- Keys live in [`src/i18n/ar.json`](../src/i18n/ar.json) and [`src/i18n/en.json`](../src/i18n/en.json). Always add keys to **both** files.
- Default/fallback language is **Arabic**.
- Error messages in stores are currently written in Arabic; keep this pattern.

### TypeScript
- All shared domain types live in [`src/types/index.ts`](../src/types/index.ts).
- Use discriminated unions for category/type fields (e.g., `CategoryId`, `ZakatType`).
- Path alias `@/` maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`).

### API
- Frontend proxies `/api/*` to `localhost:3001` during dev (see `vite.config.ts`).
- Serverless handlers in `api/` are Vercel-compatible (used in production).
- All authenticated API calls attach `Authorization: Bearer <token>` via `apiFetch()`.

## Common Pitfalls

- **RTL breakage**: Never use `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-` without an `rtl:` override. Prefer logical variants (`ms-`, `me-`, `ps-`, `pe-`).
- **Missing translations**: Always update both `ar.json` and `en.json` when adding new UI text.
- **Realm env var**: The app logs a warning and uses a placeholder if `VITE_REALM_APP_ID` is missing — this is expected in dev without `.env.local`.
- **Server not running**: The frontend dev server shows empty data if `server/` is not started separately.
