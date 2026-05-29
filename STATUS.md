# Status

## 2026-05-27

Phase: Mobile/Play Store hardening after Backend P2-B/P2-C dev deploy.

Backend dev is published at `https://stingray-app-vyfrt.ondigitalocean.app`.
Post-deploy HTTP smoke checks for public health and protected routes passed.

Mobile hardening was authorized and implemented locally:

- public API base example now targets the backend dev URL;
- production runtime no longer falls back silently to localhost;
- Settings logout clears React Query cache;
- demo fixture routes are disabled by default outside explicit non-production use;
- Expo dependency check, typecheck, lint, test, Prettier check and Mobile
  diff whitespace checks are green.

EAS build and Play submission gates were later authorized by the user. The
Android production EAS build completed successfully, but Play submission remains
blocked by release-readiness checks.

Current release stance:

- EAS build: completed successfully.
- Android artifact: downloaded to local `.codex-runtime` for inspection.
- Play Store submission: authorized, but blocked by artifact/config and
  compliance readiness.
- Backend changes: not authorized beyond the existing P2-B/P2-C recut.

Open blockers before Play submission:

- EAS production environment has no Supabase public config recorded; the built
  artifact does not contain a Supabase project URL, so production Auth is likely
  not configured.
- Account deletion public page should use the app/store name consistently; it
  still renders `Pet Marketplace` while the app/store name is `The Pet Lobby`.
- Data Safety/legal review must include `postcodes.io`, Supabase, DigitalOcean,
  auth/account data, profiles, pets, bookings, chat, reports and audit data.
- The submitted Android artifact must be smoked exactly before Play submit.

## 2026-05-28

Phase: Integration/Hardening after controlled Admin Operations P1 remote
deploy.

Admin user block/reactivation was implemented locally:

- backend exposes an admin-only user status mutation using existing
  `users.status`;
- admin UI can block active users and reactivate blocked users from
  `/admin/users`;
- self-blocking is forbidden;
- deleted users cannot be reactivated or blocked by the admin status action;
- audit logs are appended for admin status actions without PII fields;
- `/me` and Mobile functional code were not changed.

Admin Operations P1 was deployed remotely after explicit target authorization:

- DigitalOcean app: `stingray-app`;
- service: `pet-marketplace-back`;
- Backend dev URL: `https://stingray-app-vyfrt.ondigitalocean.app`;
- Backend source commit published:
  `bd73aea feat: publish admin user operations`;
- DigitalOcean deployment:
  `e00f5c9b-cc4d-4247-9c9d-e6655e582492`, phase `ACTIVE`, progress `6/6`;
- safe remote smoke after deploy confirmed health `200` and admin routes
  protected with `401` responses without token.

Validation passed locally:

- root `pnpm env:check`;
- Backend `typecheck`, `lint`, `test:e2e -- --runInBand`, `build`;
- Admin `typecheck`, `lint`, `test`, `build`;
- isolated local smoke on ports `3100`/`3101` confirmed Admin login page renders
  and unauthenticated admin user-status mutation returns `401`.

Residual risk:

- status update and audit append are implemented without a new RPC/migration, so
  database-level transactional atomicity remains a follow-up if explicitly
  authorized.
- authenticated admin remote smoke was not run in this cycle because it would
  require an approved test admin session/fixture and must avoid PII exposure.
- Admin UI remote deploy was not executed; this cycle targeted only the Backend
  service on DigitalOcean.
- no migration, EAS, Play Console action or post-deploy remote write was
  executed in this cycle.

Validation/sync pass:

- `docs/` and `.codex/` are recursively synchronized across root, Back, Mobile
  and Admin.
- Mobile-only release artifacts referenced by canonical docs were promoted to
  root `docs/` and propagated to all app copies.
- Final local gates passed: root runtime check; Backend typecheck/lint/e2e/build;
  Admin typecheck/lint/test/build; Mobile typecheck/lint/test.
- `git diff --check` is clean.
- The validated consolidation was pushed to
  `origin/codex/consolidate-checkpoints-through-094`; current documentation
  alignment should stay committed and pushed with a clean worktree.

Current north:

- Phase: Integration/Hardening.
- Stay on one explicit recorte at a time.
- Recommended next recorte: authenticated read-only Admin Operations smoke on a
  synthetic/approved admin fixture, then optional controlled status action only
  on a synthetic test user with rollback plan.
- Do not reopen Play Store submission until runtime config, exact artifact
  smoke and compliance/Data Safety blockers are handled in their own cycle.

Agenda weekly availability / multi-slot booking recorte implemented locally
after explicit Mobile and Backend authorization:

- Backend adds weekly provider availability endpoints under
  `/providers/me/availability`.
- Provider availability for booking now combines configured weekly slots with
  active booking-slot occupancy.
- Booking creation accepts multi-slot `timeSlotIds` while keeping legacy
  `timeSlotId` for existing consumers.
- New migration adds `provider_availability_rules`, `booking_slots`, estimated
  GBP booking snapshots and atomic booking-slot creation.
- Mobile tutor booking supports selecting multiple slots and seeing the
  estimated total.
- Mobile provider profile exposes weekly availability editing, and the Book tab
  shows a provider care schedule grouped by requests, confirmed care and
  history.
- Shared docs were updated and synchronized across Back, Mobile and Admin.

Validation passed locally:

- root `pnpm env:check`;
- Backend `typecheck`, `lint`, `test:e2e -- --runInBand`, `build`;
- Mobile `typecheck`, `lint`, `test`;
- Admin `typecheck`, `test`;
- `git diff --check`.

Not executed:

- no database migration was applied remotely;
- no deploy, EAS build or Play Store action was executed;
- no authenticated remote smoke was executed.

Runtime diagnostic for the weekly availability / multi-slot booking recorte:

- Mobile local public API target is `http://192.168.1.69:3000`.
- The target backend responds to `/api/v1/health` with `200`.
- The backend process on port `3000` is running `dist/src/main.js`, and the
  local `dist` build contains `/providers/me/availability`, `timeSlotIds` and
  the `create_booking_with_slots` call.
- A safe read-only schema check against the backend database connection found
  no `provider_availability_rules`, no `booking_slots`, no booking estimate
  columns and no `create_booking_with_slots` function.
- Current blocker: the runtime database has not received migration
  `20260528_002_weekly_availability_multi_slot_bookings.sql`; provider weekly
  availability and tutor multi-slot booking cannot work until that schema is
  applied to the intended environment.
- Stopped before applying migration or deploying because no additional
  migration/deploy authorization was provided for the runtime environment.

Runtime migration update after explicit authorization:

- Applied `20260528_002_weekly_availability_multi_slot_bookings.sql` to the
  database used by the local runtime backend.
- Read-only schema verification confirmed `provider_availability_rules`,
  `booking_slots`, booking estimate columns, `create_booking_with_slots`, and
  the active booking-slot uniqueness index now exist.
- Local backend `/api/v1/health` still returns `200`.
- Backend validation passed: `pnpm typecheck`, `pnpm lint`,
  `pnpm test:e2e -- --runInBand`, `pnpm build`.
- Authenticated smoke with the configured test token could not be completed
  because the token returned `401 UNAUTHENTICATED`; manual app smoke with a
  fresh signed-in provider/tutor session is still required.
- Local backend runtime was restarted after the migration/build so port `3000`
  now serves the current `dist`; startup logs confirm
  `/api/v1/providers/me/availability` is mapped before the dynamic provider
  availability route.

Location-flow hardening recorte (plan A+B) implemented locally:

- A1: provider publish now requires a resolvable base address, otherwise
  `VALIDATION_ERROR` and the profile stays `paused`.
- A2: tutor default address is a marketplace precondition; `/me` exposes the
  boolean `hasDefaultAddress` only (no address id leaked); Mobile home/search
  gate on it with a dedicated address-required state and en-GB copy.
- B: marketplace discovery filters by each provider's `service_radius_km` via
  `st_dwithin` centered on the tutor default address, in `providers_list_near`
  only (`providers_get_one` stays unfiltered for the booking flow).
- Migration `20260528_003_providers_radius_filter.sql` was applied to the
  runtime database by the user (Supabase) — "Success. No rows returned".
- Validation: Backend typecheck/lint and e2e (185 tests) green; Mobile
  typecheck/lint green. Canonical docs updated and synced to the 3 apps.
- Blocker: manual app smoke is pending — the app is not available in Expo Go nor
  locally for the user. No deploy/EAS/Play action and no push were performed.
