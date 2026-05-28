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

Phase: Admin Operations P1 local implementation after explicit backend
authorization.

Admin user block/reactivation was implemented locally:

- backend exposes an admin-only user status mutation using existing
  `users.status`;
- admin UI can block active users and reactivate blocked users from
  `/admin/users`;
- self-blocking is forbidden;
- deleted users cannot be reactivated or blocked by the admin status action;
- audit logs are appended for admin status actions without PII fields;
- `/me` and Mobile functional code were not changed.

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

Validation/sync pass:

- `docs/` and `.codex/` are recursively synchronized across root, Back, Mobile
  and Admin.
- Mobile-only release artifacts referenced by canonical docs were promoted to
  root `docs/` and propagated to all app copies.
- Final local gates passed: root runtime check; Backend typecheck/lint/e2e/build;
  Admin typecheck/lint/test/build; Mobile typecheck/lint/test.
- `git diff --check` is clean.
- Git still has uncommitted modified and untracked files, and the branch is
  ahead of origin by 1 commit.
