# Pet Marketplace - Mobile

React Native + Expo app for pet owners and providers in the UK. Android and
Google Play readiness are the first release targets, with iOS kept technically
possible.

## Current Scope

Bloco 3 creates the mobile foundation:

- Expo Router navigation.
- `en-GB` i18n dictionary for visible copy.
- Supabase Auth client-side with anon/public config only.
- SecureStore-backed session persistence.
- Backend API client for `GET /api/v1/health` and authenticated `GET /api/v1/me`.
- Base screens for sign in, home, profile, settings and legal placeholders.

The mobile app never uses `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, smoke
tokens or passwords. The backend remains the authority for RBAC and account
status.

## Local Setup

```bash
pnpm install
cp .env.example .env
pnpm start
```

Fill only public mobile values in `.env`:

```txt
EXPO_PUBLIC_API_BASE_URL=https://pet-marketplace-back.example.ondigitalocean.app
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

For Android emulator access to a local backend, use the emulator host address
instead of `localhost`, for example `http://10.0.2.2:3000`.

## Scripts

```bash
pnpm start
pnpm android
pnpm web
pnpm typecheck
pnpm lint
```

## Guardrails

- Visible user text must come from `src/i18n/en-GB.ts`.
- Do not add direct database, Storage, Realtime or RPC calls from Mobile.
- Do not log tokens, sessions, headers or full personal data.
- Do not promise verification, insurance, payment protection or guaranteed
  safety in the UI.
- Do not request sensitive device permissions until the related feature block.
