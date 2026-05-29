# Log

## 2026-05-27

- Confirmed root governance files were absent.
- Recorded Backend P2-B/P2-C deployment context from the user prompt.
- Investigated Mobile readiness without reading local secrets.
- Implemented approved Mobile hardening after literal authorization.
- Verified Mobile local checks: `pnpm test`, `expo install --check`,
  Prettier check and `git diff --check -- Pet_Marketplace_Mobile`.
- Received literal authorization for EAS build and Play Store submission.
- Created root governance bootstrap files before remote release actions.
- Fixed the Android Hermes build failure by replacing Mobile usage of the full
  `@supabase/supabase-js` client with `@supabase/auth-js` for Auth-only usage.
- Aligned Expo native dependencies and app config so `expo-doctor` passes.
- Ran Android production EAS build successfully:
  `a92defb7-6a82-4b3b-9283-0c03e437507e`, app version `0.1.0`, Android
  versionCode `5`.
- Downloaded the resulting AAB locally and inspected its structure/hash without
  submitting to Play Store.
- Blocked Play submission because production Auth public config is absent from
  the artifact and the public account deletion page brand is inconsistent.

## 2026-05-28

- Ran Admin Operations P1 governance: `@PICK`, `@C10`, `@PR`, `@V`, `@C`,
  `@S`, `@MOD_TrustSafety`, `@GSD`, `@Q` and `@M` boundary check.
- Stopped before implementation until the user provided
  `AUTORIZO ALTERAR BACKEND FORA DO RECORTE P2-B/P2-C`.
- Implemented backend admin user status mutation with allowlisted body,
  admin-only access, self-block prevention, deleted-user protection and audit
  persistence without adding a migration.
- Reworked `/admin/users` from read-only list to an operations page with block
  and reactivate server actions.
- Verified root runtime, Backend typecheck/lint/e2e/build and Admin
  typecheck/lint/test/build on Node 22.
- Ran isolated local smoke on ports `3100`/`3101`; admin login rendered and
  unauthenticated user-status mutation returned `401`.
- Validated environment parity with `@PICK/@ENV/@X/@FLOW/@GSD/@Q/@V`.
- Synchronized root `docs/` and `.codex/` to Back, Mobile and Admin with
  `pnpm sync:win`.
- Promoted Mobile release artifacts referenced by canonical docs into root
  `docs/` before resyncing: `MOBILE_SECURITY.md`, `logo/` and
  `playstore-screenshots/`.
- Normalized text line endings to LF so `git diff --check` passes.
- Re-ran final local gates: root `env:check`; Backend typecheck/lint/e2e/build;
  Admin typecheck/lint/test/build; Mobile typecheck/lint/test.
- Pushed `11f29d5 chore: consolidate validated marketplace progress` to
  `origin/codex/consolidate-checkpoints-through-094`.
- Revalidated post-push alignment: branch synchronized with origin, worktree
  clean, `docs/` and `.codex/` synchronized across root/Back/Mobile/Admin.
- Recorded the operating north: Integration/Hardening, one explicit recorte at
  a time, next recommended cycle is controlled remote deploy/smoke for Admin
  Operations P1.
- Opened the controlled remote deploy cycle for Admin Operations P1 after
  confirming target authorization:
  `stingray-app / pet-marketplace-back / https://stingray-app-vyfrt.ondigitalocean.app`.
- Confirmed safe credential context without printing secrets: GitHub active
  account `thepetlobbyapp-coder`; DigitalOcean context `petmarketplace`, account
  active.
- Reconciled Backend source checkout with `origin/main`, preserving remote
  hotfix commits `26ea1d2` and `2b4c03e`, then applied only the Admin
  Operations P1 backend recorte.
- Validated the publish checkout with `pnpm typecheck`, `pnpm lint`, focused
  admin e2e, `pnpm build`, full e2e and `git diff --check`.
- Published Backend commit `bd73aea feat: publish admin user operations` to
  `thepetlobbyapp-coder/Pet_Marketplace_Back@main`.
- DigitalOcean deployment
  `e00f5c9b-cc4d-4247-9c9d-e6655e582492` reached `ACTIVE` with progress `6/6`.
- Remote safe smoke confirmed health `200` and admin routes protected with
  `401` responses without token; no authenticated smoke, migration, EAS, Play
  Console or post-deploy remote write was executed.
- Updated `PROJECT.md`, `STATUS.md`, `LOG.md` and `docs/PROGRESS.md`, then ran
  `pnpm sync:win` to propagate progress docs to Back, Mobile and Admin.
- Rechecked root runtime and Backend `pnpm test`; e2e suite passed with 17
  suites and 174 tests.

[2026-05-28] Implemented the authorized weekly provider availability and
multi-slot booking recorte locally:
- Added backend weekly availability endpoints and multi-slot booking contract.
- Added Supabase migration for `provider_availability_rules`, `booking_slots`,
  estimated GBP snapshots and atomic booking-slot creation.
- Updated Mobile booking to select multiple slots and show estimated totals.
- Added provider profile weekly availability editing and grouped provider care
  schedule.
- Updated and synchronized shared docs; recorded the booking/availability
  decision in DECISIONS.md.
- Validation passed: root env check; Backend typecheck/lint/e2e/build; Mobile
  typecheck/lint/test; Admin typecheck/test; git diff whitespace check.
- No remote migration, deploy, EAS build, Play Store action or authenticated
  remote smoke was executed.

[2026-05-28] Diagnosed runtime failure for weekly availability and multi-slot
booking:
- Confirmed Mobile public API base URL is `http://192.168.1.69:3000`.
- Confirmed the local target backend responds to `/api/v1/health` with `200`.
- Confirmed port `3000` is running `node dist/src/main.js` and local `dist`
  contains the new availability endpoints and multi-slot booking contract.
- Ran a read-only schema check via the backend database connection; the runtime
  database does not have `provider_availability_rules`, `booking_slots`, the
  booking estimate columns or `create_booking_with_slots`.
- Stopped before applying migration/deploy because the runtime blocker is
  schema deployment and no explicit additional authorization was provided for
  migration or deploy actions.

[2026-05-28] Applied the authorized runtime migration for weekly availability:
- Ran `20260528_002_weekly_availability_multi_slot_bookings.sql` through the
  guarded backend SQL runner after explicit authorization.
- Verified the runtime schema now has `provider_availability_rules`,
  `booking_slots`, booking estimate columns, `create_booking_with_slots`, and
  the expected slot uniqueness index.
- Rechecked local backend health: `/api/v1/health` returned `200`.
- Backend validation passed: typecheck, lint, e2e with 18 suites / 178 tests,
  and build.
- Authenticated smoke with the configured test token returned
  `401 UNAUTHENTICATED`; a fresh app session is needed for final provider/tutor
  manual smoke.

[2026-05-28] Restarted the local backend runtime after the user still saw
runtime `400` responses:
- Stopped the stale process on port `3000` and started `node dist/src/main.js`
  from the current Backend build.
- Confirmed `/api/v1/health` returns `200` after restart.
- Confirmed startup route map includes `/api/v1/providers/me/availability`
  before `/api/v1/providers/:id/availability`.

[2026-05-28] Implemented the location-flow hardening recorte (plan A+B):
- A1 (Backend): `upsertOwnProviderListing` now blocks publish (`status = active`)
  when no base address is resolvable (request value or stored), throwing
  `VALIDATION_ERROR` and keeping the profile `paused`.
- A2 (Backend): tutor profile now carries an internal `defaultAddressId`; `/me`
  exposes only the boolean `hasDefaultAddress` (the raw address id stays in the
  forbidden-fields contract and is never serialized).
- A2 (Mobile): home and search gate the marketplace on `hasTutorDefaultAddress`;
  added `TutorAddressRequiredState`, the address-required count label and the
  `access.addressRequired.*` / `search.count.addressRequired` en-GB copy.
- B (DB): added migration
  `20260528_003_providers_radius_filter.sql`, recreating only
  `providers_list_near` to filter by each provider's `service_radius_km` via
  `st_dwithin` centered on the tutor default address; `providers_get_one`
  untouched. The user applied this migration to the runtime DB (Supabase),
  confirmed "Success. No rows returned".
- Docs: updated canonical `docs/04`, `docs/05`, `docs/06` and synced to the 3
  apps via `npm run sync:win`.
- Validation: Backend typecheck/lint and full e2e (185 tests) green; Mobile
  typecheck/lint green.
- Not executed: manual app smoke is blocked — the app is not available in Expo
  Go nor locally for the user; no deploy/EAS/Play action; no push.

[2026-05-29] Diagnosed and repaired the `providers_list_near` radius regression:
- Ran read-only coverage checks against the backend Supabase database. Result:
  6 active provider listings existed, and all 6 active provider profiles lacked
  `base_address_id`; tutor default addresses were geocoded for 3 tutors.
- Confirmed the empty marketplace was caused by legacy active providers being
  filtered out by the stricter 003 RPC before distance calculation.
- Added migration `20260529_004_backfill_provider_base_addresses.sql` to backfill
  active providers from their own geocoded default/oldest address when possible,
  then pause any remaining active listing without a valid own geocoded base.
- Kept `providers_list_near` strict and did not touch `providers_get_one`, so
  marketplace discovery remains radius-gated while booking detail remains
  reachable.
- Added backend e2e coverage for same-postcode inclusion, outside-radius
  exclusion, provider-without-base exclusion, and SQL guardrails.
- Validation passed: Backend `pnpm typecheck`, `pnpm lint`, `pnpm test`;
  Mobile `pnpm typecheck`, `pnpm lint`; root `npm run sync:win`;
  `git diff --check`.
- No remote write, migration application, deploy, push, EAS or Play action was
  executed.

[2026-05-29] Validated marketplace visibility for `israel@pet.com` and added
address deletion:
- Ran read-only Supabase checks for `israel@pet.com`. The user has tutor and
  provider roles, a geocoded tutor default address at `SW1A 1AA`, and a
  geocoded provider base address at `SW1A 1AA`.
- Confirmed `providers_list_near` returns 2 providers for that tutor. Empty
  results observed in the app are explained by category filters (`walk = 0`,
  `boarding = 0`) and by the intentional own-provider exclusion: the user's own
  `Boarding` listing is not shown to themselves.
- Confirmed runtime provider data coverage after the 004 repair: active
  providers have base addresses and base locations, so the 003 radius RPC is no
  longer dropping all candidates.
- Added authenticated `DELETE /api/v1/addresses/:id` with owner scoping and
  `204`/`404`/`400` contracts.
- Blocked deletion of an active provider's `base_address_id` with `409
  CONFLICT`, preventing users from deleting the address that keeps their active
  listing eligible for radius discovery.
- Added Mobile address deletion from Profile with a confirmation state and
  cache invalidation for both addresses and `/me`.
- Validation passed: Backend `pnpm typecheck`, `pnpm lint`, `pnpm test`;
  Mobile `pnpm typecheck`, `pnpm lint`; Backend `pnpm build`;
  `git diff --check`; local backend and Expo endpoints healthy.

[2026-05-29] Implemented the 5-star rating recorte (no comment) with a
proof-of-service gate across Backend, DB and Mobile, after
`AUTORIZO ALTERAR BACKEND FORA DO RECORTE P2-B/P2-C` and
`AUTORIZO IMPLEMENTAR AJUSTES MOBILE DO PLANO APROVADO`:
- Routed the plan through the Cético: verdict `APROVADO COM RESSALVAS` with 5
  required adjustments incorporated (aggregate recompute lock, per-perspective
  `canReview`, descoped user-facing review reports, contiguity in the RPC source
  of truth, explicit review-eligibility rule).
- Backend: added migration `20260529_005_contiguous_booking_slots.sql`
  (contiguity guard in `create_booking_with_slots`) and
  `20260529_006_reviews.sql` (`reviews` table, `bookings.tutor_confirmed_at`,
  `review_status` enum, `recompute_provider_rating` with `for update`,
  `submit_review`). Added contiguity validation in `parseTimeSlotIdsField`,
  `SubmitReviewRequestDto`, `ReviewResponseDto`,
  `canReview`/`myReviewRating`/`tutorConfirmedAt` on the booking contract,
  `POST /bookings/:id/review` and `POST /bookings/:id/confirmation`,
  `submitReview`/`confirmBookingService`/`attachReviewState` (best-effort) in
  the admin service, and the Database types.
- DB: the user applied migrations 005 and 006 to the runtime
  (`thepetlobbyapp-dev` / Supabase); both returned "Success. No rows returned".
- Mobile: added interactive `RatingInput`, `TutorReviewActions` in the Book tab
  (confirm service then rate/edit; awaiting-tutor note on the provider side),
  `confirmBookingService`/`submitReview` API clients, review fields on the
  booking type plus `ReviewResponse`, and `book.review.*` en-GB copy.
- Domain rule: one review per booking (per service, never per slot or day);
  service hours must be a single contiguous block.
- Validation passed: Backend typecheck/lint/e2e (19 suites, 207 tests)/build;
  Mobile typecheck/lint/test and `prettier --check` on changed files;
  `git diff --check` clean.
- Not executed: deploy, EAS, Play action, push, and final validators (S/P/V).
  Manual app smoke still pending.

[2026-05-29] Ran the read-only S/P/V validation over the rating diff: Security and
Performance APROVADO; Final validator APROVADO COM RESSALVAS (R1: admin review
moderation not exposed by API; R2: SQL/RPC logic only covered by inspection +
manual smoke). Re-ran Backend typecheck/lint/e2e (207)/build, Mobile
typecheck/lint/test + prettier --check, and git diff --check — all green.

[2026-05-29] Closed ressalva R1 — admin review moderation endpoint (no migration):
- Added `PATCH /api/v1/admin/reviews/:id/status` (`@Roles('admin')`) accepting
  `visible | hidden_by_admin` via a strict allowlist DTO
  (`update-admin-review-status-request.dto.ts`).
- `setAdminReviewStatusWithAudit` updates the review status, calls
  `recompute_provider_rating` only when the status changes, and appends an audit
  log (`admin.review_hidden` / `admin.review_restored`, target_type `review`)
  with no PII. The response reuses `ReviewResponseDto` and never exposes
  `reviewer_user_id`. No new migration needed (audit target types are free-form).
- Added admin e2e coverage: hide returns a safe body, role guard `403`,
  unsafe/unsupported payload `400`, missing review `404`.
- Validation passed: Backend typecheck/lint/e2e (19 suites, 211 tests)/build;
  `git diff --check` clean.
- Pending: Admin Next.js UI to call the endpoint (separate surface), and the
  S/P/V re-pass over this addition; no deploy/EAS/Play/push executed.

[2026-05-29] Built the Admin review moderation UI and its backing list endpoint:
- Backend: added `GET /api/v1/admin/reviews` (`@Roles('admin')`, cursor
  pagination mirroring admin bookings) with `listAdminReviews`,
  `AdminReviewRecord`, `AdminReviewResponseDto`/`AdminReviewListResponseDto`.
  The list never exposes `reviewer_user_id`.
- Admin (Next.js): added the `reviews` resource (type, parser, forbidden-field
  assertion), `listAdminReviews`/`updateAdminReviewStatus` on the resource
  client, enabled the previously-disabled `reviews` route, and added
  `app/admin/reviews/page.tsx` (rating/status/booking table with Hide/Restore
  server actions and pagination).
- Updated admin tests (shell route status, resource-client coverage, and the
  two view-model client mocks) to include the new endpoints.
- Validation passed: Backend typecheck/lint/e2e (19 suites, 213 tests)/build;
  Admin typecheck/lint/test/build; `git diff --check` clean.
- Not executed: deploy, EAS, Play action or push. No migration needed for this
  addition (reads existing `reviews`; moderation audit uses free-form types).

[2026-05-29] Ran a safe HTTP route smoke for the rating endpoints (no secrets):
- Local backend `/api/v1/health` returned `200` on both `localhost` and
  `192.168.1.69`.
- First smoke found the new routes (`POST /bookings/:id/review`,
  `POST /bookings/:id/confirmation`, `GET /admin/reviews`) returning `404`,
  proving the running process on port `3000` was serving a stale `dist` from
  before this recorte (controls: `GET /bookings` `401`, missing route `404`).
- Rebuilt `dist` (`nest build`), stopped the stale node PID on `3000`, and
  restarted via `pnpm start` (background); `/api/v1/health` returned `200`.
- Re-smoke confirmed all three new routes now return `401` without a token
  (mapped + auth-protected), controls still `401`/`404`. Authenticated
  functional smoke (tutor confirm+rate, average update, Admin Hide/Restore)
  remains a manual step needing a real signed-in session.
- The DigitalOcean dev backend was not touched and does not carry this feature
  (no deploy authorized).
