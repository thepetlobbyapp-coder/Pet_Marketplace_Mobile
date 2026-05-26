# EAS_BUILD_PREFLIGHT_READINESS - The Pet Lobby

**Date:** 2026-05-26
**Checkpoint:** 088
**Status:** GO COM RESSALVAS for future EAS build preparation; no EAS build,
no deploy, no Play Console write, no remote write and no fixture change.
**Scope:** technical pre-flight for a future Android EAS build after the
Checkpoint 087 screenshot package.

This document is sanitized. It does not contain reviewer credentials, complete
emails, passwords, tokens, Authorization headers, full IDs, private reports or
private message text.

---

## 1. Verdict

| Target | Verdict | Conditions |
|---|---|---|
| Local Mobile code readiness | GO | Typecheck and lint passed. |
| Future EAS build preparation | GO COM RESSALVAS | EAS config exists, but asset and permission caveats remain before a Play-ready build. |
| Future signed build smoke | REQUIRED | Must be repeated against the exact AAB/APK artifact after EAS. |
| Play Console / internal track final use | NO-GO in this checkpoint | Still blocked by Checkpoint 084 human/legal approval and exact-build smoke. |

No EAS command that creates a build was run. No submit/internal-track action was
run. No Play Console, deploy, remote fixture mutation, booking, message, report,
block or account-deletion write was performed.

---

## 2. Evidence Read

Readiness docs:

- `docs/30_PLAYSTORE_RELEASE_READINESS.md`
- `docs/32_SPEC_ASSET_ICON_SPLASH.md`
- `docs/38_PLAYSTORE_FINAL_SCREENSHOTS_READINESS.md`
- `docs/PROGRESS.md`

Mobile config and code:

- `Pet_Marketplace_Mobile/app.json`
- `Pet_Marketplace_Mobile/eas.json`
- `Pet_Marketplace_Mobile/package.json`
- `Pet_Marketplace_Mobile/.env.example`
- `Pet_Marketplace_Mobile/src/lib/env.ts`
- `Pet_Marketplace_Mobile/src/components/AvatarUploader.tsx`
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`

Screenshot baseline:

- `Pet_Marketplace_Mobile/docs/playstore-screenshots/checkpoint-087/`

---

## 3. EAS Readiness Checklist

| Area | Result | Evidence / note |
|---|---|---|
| EAS config | GO | `eas.json` exists with `development`, `preview` and `production` profiles. |
| Production artifact type | GO | `production.android.buildType` is `app-bundle`. |
| Android package | GO | `app.thepetlobby.mobile` is set in `app.json`; immutable after first publication. |
| iOS bundle id | GO | `app.thepetlobby.mobile` is set, though iOS remains out of current Play Store scope. |
| App versioning | GO COM RESSALVAS | `version` is `0.1.0`; `android.versionCode` is `2`; `eas.json` uses remote app version source and production `autoIncrement`. |
| Public env model | GO COM RESSALVAS | `.env.example` limits config to `EXPO_PUBLIC_*` and warns not to add secrets; actual profile values still need to be configured outside Git before build. |
| Local code checks | GO | `pnpm typecheck` and `pnpm lint` passed. |
| Screenshot baseline | GO | Checkpoint 087 has 8 valid PNG files at `780x1688`. |
| App icon / splash asset | NO-GO FOR PLAY-READY BUILD | Current `pet-lobby-paw-marker-logo.png` is `288x288`; docs/32 requires a dedicated `1024x1024` PNG before Play-ready build. |
| Android permissions | GO COM RESSALVAS | `android.permissions` is `[]`, but `expo-image-picker` is configured and may add photo/camera permission surfaces in native build. |
| Avatar/camera/gallery feature | GO COM RESSALVAS | UI is gated by `EXPO_PUBLIC_ENABLE_AVATAR_UPLOAD`; keep it `false` for the next Play-ready smoke unless Data Safety is updated. |
| Keystore / EAS project setup | PENDING | Needs authorized Expo account decision and managed keystore/project setup when EAS is explicitly allowed. |

---

## 4. Required Commands and Results

| Command | Exit | Result |
|---|---:|---|
| `cd Pet_Marketplace_Mobile; pnpm typecheck` | 0 | TypeScript passed. |
| `cd Pet_Marketplace_Mobile; pnpm lint` | 0 | ESLint passed. |
| `git diff --check` | 0 | Passed; existing LF/CRLF normalization warnings only. |
| Checkpoint 087 PNG validation | 0 | Eight PNG files found, all `780x1688`. |
| Docs sync hash check | 0 | `PROGRESS.md` and docs 38 were synced root/Back/Mobile/Admin before this checkpoint; docs 39 is synced by this checkpoint. |
| Asset metadata check | 0 | Current app icon asset is `288x288` PNG, not the required `1024x1024` production asset. |
| Permission/flag scan | 0 | Found `expo-image-picker`, camera/photo permission strings and `EXPO_PUBLIC_ENABLE_AVATAR_UPLOAD=false` in sample config. |

---

## 5. Guardrails Preserved

- No EAS build.
- No EAS submit.
- No Play Console access.
- No internal track creation.
- No deploy.
- No remote fixture mutation.
- No booking, message, report, block or account-deletion write.
- `Credenciais.txt` was not read.
- `.env` contents were not read or printed.
- No secrets, tokens, Authorization headers, complete emails or complete IDs
  were recorded.

---

## 6. Blocking Gaps Before Play-Ready EAS

1. Replace the current `288x288` icon/splash placeholder with a dedicated
   `1024x1024` PNG that satisfies `docs/32_SPEC_ASSET_ICON_SPLASH.md`.
2. Decide the avatar permission posture for the build:
   - keep `EXPO_PUBLIC_ENABLE_AVATAR_UPLOAD=false` and remove/defer native
     image-picker permission surface if Play Data Safety should not include
     photo/camera access; or
   - keep image picker in build only after Data Safety, permissions copy and
     screenshots/claims are reviewed for avatar upload.
3. Configure production/preview `EXPO_PUBLIC_*` values in the authorized EAS
   environment without committing secrets.
4. Confirm the Expo account/project and keystore policy before running any EAS
   command that creates a build.
5. Repeat smoke on the exact signed artifact after EAS and before any Play
   Console/internal-track action.
6. Close Checkpoint 084 human/legal blockers: legal bases by purpose, retention
   classes, Terms/Data Safety wording and operational ownership.

---

## 7. Official References Checked

Checked on 2026-05-26:

- Expo EAS `eas.json`: https://docs.expo.dev/build/eas-json/
- Expo EAS app versions: https://docs.expo.dev/build-reference/app-versions/
- Expo permissions guide: https://docs.expo.dev/guides/permissions/
- Expo ImagePicker: https://docs.expo.dev/versions/latest/sdk/imagepicker/

---

## 8. Next Step

Recommended next checkpoint:

`Checkpoint 089 - Resolve Play-ready icon and avatar permission posture before
EAS build execution`

Conditions:

- Do not run EAS until explicitly requested.
- Keep Play Console real writes out of scope.
- If the next path requires any remote fixture mutation, stop and ask for the
  literal remote-write authorization before proceeding.
