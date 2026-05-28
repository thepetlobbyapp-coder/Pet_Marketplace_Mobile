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
