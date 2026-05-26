# EAS Asset and Avatar Permission Readiness - The Pet Lobby

**Date:** 2026-05-26
**Checkpoint:** 089
**Status:** NO-GO for a future Play-ready EAS build until the 1024x1024
icon/splash asset exists; avatar/camera/gallery permission posture resolved
locally by deferring native image picking.
**Scope:** local technical correction and documentation only. No EAS build, no
EAS submit, no Play Console access, no deploy, no remote write and no fixture
change.

This document is sanitized. It does not contain reviewer credentials, complete
emails, passwords, tokens, Authorization headers, full IDs, private reports or
private message text.

---

## 1. Verdict

| Target | Verdict | Reason |
|---|---|---|
| Future Play-ready EAS build | NO-GO | No local 1024x1024 Play-ready icon/splash PNG exists. |
| Avatar/camera/gallery posture | GO | `expo-image-picker` was removed/deferred from the Mobile native surface. |
| Android permissions posture | GO COM RESSALVAS | `android.permissions` remains `[]`; exact native manifest must still be checked after a future signed build. |
| Play Console / submit / internal track | NO-GO | Out of scope and still blocked by human/legal Checkpoint 084 plus exact-build smoke. |

No EAS command that creates a build was run. No submit/internal-track action was
run. No Play Console, deploy, remote fixture mutation, booking, message, report,
block or account-deletion write was performed.

---

## 2. Asset Decision

Decision: **do not replace the asset**.

Local image scan found no acceptable `1024x1024` PNG:

| Path | Dimensions | Decision |
|---|---:|---|
| `docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Mobile/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Mobile/assets/pet-lobby-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Back/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Admin/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |

The local `Pet_Marketplace_Mobile01.jpeg` and `Pet_Marketplace_Mobile02.jpeg`
files are rectangular JPEGs, not Play-ready square PNG icon/splash assets.

The blocker in `docs/32_SPEC_ASSET_ICON_SPLASH.md` remains open. A designer or
client must provide a real 1024x1024 PNG that passes the safe-area checklist
before any Play-ready EAS build is authorized.

---

## 3. Avatar and Permissions Decision

Decision: **keep avatar upload out of the Play-ready build and remove/defer
native image picking**.

Changes:

- Removed the `expo-image-picker` config plugin from
  `Pet_Marketplace_Mobile/app.json`.
- Removed `expo-image-picker` from `Pet_Marketplace_Mobile/package.json` and
  `Pet_Marketplace_Mobile/pnpm-lock.yaml`.
- Confirmed no public avatar-upload flag remains in `.env.example`,
  `src/lib/env.ts` or `src/types/env.d.ts`.
- Updated Profile to render read-only avatars only; no camera/gallery picker
  path is reachable in the Play-ready UI.
- Kept `expo-image`, because it is used only to display existing avatar URLs
  returned by the API and does not create the camera/gallery permission posture.

Data Safety posture for this checkpoint: do not declare camera, gallery or
device photo collection for avatar upload. If avatar upload returns later,
reintroduce picker permissions only with fresh Data Safety, permission-copy,
manifest and screenshot/claim review.

---

## 4. Required Commands and Results

| Command | Exit | Result |
|---|---:|---|
| `cd Pet_Marketplace_Mobile; pnpm typecheck` | 0 | TypeScript passed. |
| `cd Pet_Marketplace_Mobile; pnpm lint` | 0 | ESLint passed. |
| `git diff --check` | 0 | Passed; existing LF/CRLF normalization warnings only. |
| Local asset dimension scan | 0 | No 1024x1024 Play-ready PNG found. |
| Permission/package scan | 0 | No `expo-image-picker`, `ImagePicker` or avatar-upload flag remains in Mobile app/config/package surface. |

---

## 5. Files Changed

- `Pet_Marketplace_Mobile/app.json`
- `Pet_Marketplace_Mobile/package.json`
- `Pet_Marketplace_Mobile/pnpm-lock.yaml`
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`
- `Pet_Marketplace_Mobile/src/api/types.ts`
- `Pet_Marketplace_Mobile/src/components/AvatarUploader.tsx`
- `docs/00_INDICE_DOCUMENTACAO.md`
- `docs/10_SPEC_PLAYSTORE_RELEASE.md`
- `docs/11_SPEC_PRIVACY_DATA_SAFETY.md`
- `docs/17_DOCS_TRACEABILITY_MAP.md`
- `docs/30_PLAYSTORE_RELEASE_READINESS.md`
- `docs/32_SPEC_ASSET_ICON_SPLASH.md`
- `docs/40_EAS_ASSET_AVATAR_PERMISSION_READINESS.md`
- Equivalent documentation copies under `Pet_Marketplace_Back/docs/`,
  `Pet_Marketplace_Mobile/docs/` and `Pet_Marketplace_Admin/docs/`.

---

## 6. Remaining Gaps

1. Provide and validate the real 1024x1024 PNG icon/splash asset from
   designer/client.
2. Configure authorized EAS project/account, keystore policy and production
   `EXPO_PUBLIC_*` values outside Git.
3. Run exact signed-artifact smoke only after an EAS build is explicitly
   authorized.
4. Close Checkpoint 084 human/legal blockers for Data Safety, legal bases by
   purpose and retention classes before Play Console final use.

---

## 7. Next Step

Only after explicit authorization and after the 1024x1024 PNG is committed and
validated:

`cd Pet_Marketplace_Mobile; eas build --platform android --profile production`

Then smoke the exact signed artifact before any Play Console/internal-track
action.

---

## 8. Checkpoint 090 - local asset integration gate

**Date:** 2026-05-26
**Status:** NO-GO for asset integration and NO-GO for future Play-ready EAS
build. The required local PNG path was not provided, and the local scan found no
acceptable 1024x1024 PNG.

### Impact-validator verdict

The mandatory `impact-validator` gate was run before edits. Verdict:

- Asset replacement/propagation is **rejected for this checkpoint** because no
  local 1024x1024 PNG was provided or found.
- Only documentation of the asset NO-GO, validation of the existing
  no-picker posture and local checks are authorized.
- Creating an asset, using a JPEG/screenshot, running EAS, accessing Play
  Console, touching fixtures, reading credentials or doing any remote write are
  blocked.

### Asset decision

No asset was replaced. Current local PNG candidates remain:

| Path | Dimensions | Decision |
|---|---:|---|
| `docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Mobile/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Mobile/assets/pet-lobby-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Back/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Admin/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |

The screenshot PNGs under `Pet_Marketplace_Mobile/docs/playstore-screenshots/`
are not icon/splash assets and must not be reused for this purpose.

### Avatar and permissions confirmation

The Checkpoint 089 posture remains valid:

- `expo-image-picker` is absent from the Mobile app/config/package surface.
- `android.permissions` remains `[]`.
- Avatar upload, camera and gallery remain outside the Play-ready build scope.

### Checkpoint 090 result

Future EAS build remains blocked until a designer/client-provided PNG
1024x1024 is available locally, validated against
`docs/32_SPEC_ASSET_ICON_SPLASH.md`, committed and explicitly authorized for
the next EAS step.

### Checkpoint 090 command results

| Command | Exit | Result |
|---|---:|---|
| `cd Pet_Marketplace_Mobile; pnpm typecheck` | 0 | TypeScript passed. |
| `cd Pet_Marketplace_Mobile; pnpm lint` | 0 | ESLint passed. |
| Canonical asset dimension check | 2 | Expected NO-GO: `docs/assets/pet-lobby-paw-marker-logo.png` is `288x288`, not `1024x1024`. |
| Local PNG scan | 0 | No `1024x1024` PNG candidate found. |
| Picker/avatar flag scan | 0 | No `expo-image-picker`, `ImagePicker` or avatar-upload flag remains in the Mobile surface checked. |
| `git diff --check` | 0 | Passed; existing LF/CRLF normalization warnings only. |
| Docs hash sync check | 0 | Root docs and Back/Mobile/Admin copies match for the updated C090 docs. |

---

## 9. Checkpoint 091 - approved local asset integration

**Date:** 2026-05-26
**Status:** GO for local icon/splash asset readiness. No EAS build, EAS
submit, Play Console, deploy, fixture change, credential read or remote write
was performed.

### Impact-validator verdict

The gate was run before edits. Verdict: **GO for local asset integration only**.

- Concrete change: replace the canonical icon/splash PNG with the validated
  local designer/client asset while preserving the canonical filename.
- Affected layers: Mobile asset/config references and documentation only.
- Blast radius: `docs/assets/pet-lobby-paw-marker-logo.png`, equivalent
  Back/Mobile/Admin asset copies, `Pet_Marketplace_Mobile/app.json` reference
  confirmation and readiness/progress docs.
- Blocked actions: EAS, Play Console, deploy, credentials, fixture changes,
  invented assets, JPEG/screenshot reuse and creative image editing.

### Asset decision

Selected candidate:

`Pet_Marketplace_Mobile/docs/logo/a pet-lobby-icon-1024.png`

| Check | Result |
|---|---|
| PNG / dimensions | PNG real, `1024x1024` |
| Color | 8-bit RGB |
| Background | `#FAFAFC` |
| Text/copy | None observed visually |
| Safe area | bbox `576x560`, 0 px outside center circle r=313 |
| SHA256 | `BAB5E79217F7947BA1A04924A401E5F9DFDD349A3D7EC795DFB56D36A9E6442E` |

The canonical asset and all Back/Mobile/Admin copies now carry the same hash.

### Avatar and permissions confirmation

- `Pet_Marketplace_Mobile/app.json` still points `expo.icon`,
  `expo.splash.image` and `expo.android.adaptiveIcon.foregroundImage` to
  `./docs/assets/pet-lobby-paw-marker-logo.png`.
- `android.permissions` remains `[]`.
- `expo-image-picker`, `ImagePicker`, `EXPO_PUBLIC_ENABLE_AVATAR_UPLOAD`,
  `enableAvatarUpload`, `photosPermission` and `cameraPermission` are absent
  from the checked Mobile app/config/package surface.

### Checkpoint 091 command results

| Command | Exit | Result |
|---|---:|---|
| Candidate PNG validation | 0 | All three candidates were PNG real `1024x1024`, RGB 8-bit. |
| Safe area scan | 0 | Candidate `a` passed; candidate `b` and previous candidate failed. |
| Final asset hash/dimension check | 0 | Canonical and Back/Mobile/Admin copies match at `1024x1024`. |
| `cd Pet_Marketplace_Mobile; pnpm typecheck` | 0 | TypeScript passed. |
| `cd Pet_Marketplace_Mobile; pnpm lint` | 0 | ESLint passed. |
| Picker/avatar flag scan | 1 | No forbidden patterns found in the checked app/config/package surface. |
| `git diff --check` | 0 | Passed; existing LF/CRLF normalization warnings only. |

---

## 10. Checkpoint 092 - final local EAS preflight

**Date:** 2026-05-26
**Status:** GO for local preflight, NO-GO for remote EAS execution in this
checkpoint. The literal authorization phrase
`AUTORIZO EAS BUILD REAL ANDROID PRODUCTION` was not provided.

### Impact-validator verdict

Verdict: **GO for local preflight only / NO-GO for remote actions**.

- Concrete change: prepare the Android production build decision with local
  checks.
- Affected layers: Mobile EAS/app config, asset readiness and documentation.
- Blast radius: `Pet_Marketplace_Mobile`, `eas.json`, `app.json`, readiness docs
  and progress docs.
- Blocked actions: EAS build, EAS submit, Play Console, deploy, fixture changes,
  backend/Admin/database changes, credential reads and any remote write.

### Local preflight result

- `eas.json` keeps `build.production.android.buildType = app-bundle`.
- `eas.json` keeps `build.production.channel = production`.
- `Pet_Marketplace_Mobile/app.json` keeps icon/splash/adaptive icon paths on
  `./docs/assets/pet-lobby-paw-marker-logo.png`.
- The final asset remains PNG real `1024x1024`, RGB 8-bit, with identical hash
  across root/Back/Mobile/Admin.
- `android.permissions` remains `[]`.
- `expo-image-picker`, `ImagePicker`, `EXPO_PUBLIC_ENABLE_AVATAR_UPLOAD`,
  `enableAvatarUpload`, `photosPermission` and `cameraPermission` were not
  found in the checked Mobile app/config/package surface.

### Checkpoint 092 command results

| Command | Exit | Result |
|---|---:|---|
| Asset hash/dimension check | 0 | Root/Back/Mobile/Admin copies match at PNG `1024x1024`. |
| `app.json` parse/check | 0 | Icon/splash/adaptive icon refs and `android.permissions: []` confirmed. |
| `eas.json` parse/check | 0 | Production Android remains `app-bundle`. |
| Picker/avatar flag scan | 1 | No forbidden patterns found in checked app/config/package files. |
| `.env.example` safe scan | 0 | No forbidden patterns found; real `.env` was not read. |
| `cd Pet_Marketplace_Mobile; pnpm typecheck` | 0 | TypeScript passed. |
| `cd Pet_Marketplace_Mobile; pnpm lint` | 0 | ESLint passed. |
| `git diff --check` | 0 | Passed; existing LF/CRLF normalization warnings only. |

### Next gate

Run remote EAS only after the exact phrase
`AUTORIZO EAS BUILD REAL ANDROID PRODUCTION` is provided and Expo
account/project, keystore policy and profile envs are ready outside Git.

---

## 11. Checkpoint 092 - authorized remote EAS build submission

**Date:** 2026-05-26
**Status:** Remote Android production build submitted to EAS. No EAS submit,
Play Console, deploy, fixture change, backend/Admin/database change or
credential print was performed.

### Impact-validator verdict

Verdict: **GO for the minimum EAS commands required for Android production
build submission** after the literal authorization phrase was provided.

Authorized commands were limited to:

- masked EAS login check;
- `eas init --non-interactive` and `eas init --non-interactive --force` after
  the first build attempt reported that the project was not configured;
- `eas build --platform android --profile production --non-interactive`;
- build status query.

### EAS result

- `eas init --non-interactive --force` created/linked the EAS project and
  modified `Pet_Marketplace_Mobile/app.json` with `owner` and
  `extra.eas.projectId`.
- `eas build --platform android --profile production --non-interactive`
  uploaded the project archive and submitted the remote Android production
  build.
- Initial remote status from `eas build:list`: `IN_QUEUE`.
- Remote `appBuildVersion`: `3`.
- Cloud Android keystore was created by EAS.
- Local wait process was stopped after submission; the remote build was not
  cancelled.

### EAS warnings to resolve before Play Console

- No EAS production environment variables with Plain text or Sensitive
  visibility were found.
- The production profile declares channel `production`, but `expo-updates` is
  not installed, so EAS warned that channels are not active for updates.
- `android.versionCode` remains in local `app.json`, but EAS warned it is
  ignored when `cli.appVersionSource` is `remote`.
- The uploaded archive was about 398 MB; add `.easignore` later if build
  uploads need to be slimmer.

### Command results

| Command | Exit | Result |
|---|---:|---|
| `eas whoami` masked check | 0 | EAS login active; identity not printed. |
| `eas build --platform android --profile production --non-interactive` before init | 1 | Blocked because EAS project was not configured. |
| `eas init --non-interactive` | 1 | Reported project did not exist and required `--force`. |
| `eas init --non-interactive --force` | 0 | Project created/linked; `app.json` modified. |
| `eas build --platform android --profile production --non-interactive` | timed out locally after submission | Project uploaded; remote build submitted and left in EAS queue. |
| `eas build:list --platform android --limit 1 --json --non-interactive` | 0 | Latest Android production build status `IN_QUEUE`. |
| Post-init `pnpm typecheck` | 0 | TypeScript passed. |
| Post-init `pnpm lint` | 0 | ESLint passed. |
| Post-init `git diff --check` | 0 | Passed. |

### Next step

Poll the EAS build until it reaches a terminal state. If it succeeds, smoke the
exact signed artifact before any EAS submit or Play Console action.
