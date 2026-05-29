# MOBILE_SECURITY — The Pet Lobby (Mobile)

**Status:** Living document, updated as each sensitive surface ships.
**Last revision:** 2026-05-25 (Avatar Upload subwave A1..A4).
**Scope:** Mobile-side hardening rules. Backend rules live in
`Pet_Marketplace_Back/docs/`.

---

## 1. Principles

- Mobile **never** talks directly to Supabase. Every authenticated read
  or write goes through the Nest API.
- Tokens live in `expo-secure-store` (Keychain / Keystore). Never in
  `AsyncStorage`.
- Logs must not contain tokens, full e-mails, signed URLs, file paths
  on the device, or any other PII.
- Sensitive operations confirm explicitly (e.g. removing the avatar)
  and use rate-limited endpoints on the backend.

---

## 2. Avatar Upload (Bloco Avatar — A1..A4)

### Client-side rules

1. **Picker permissions** are requested just-in-time, never on app start.
   - Library: `ImagePicker.requestMediaLibraryPermissionsAsync()`
   - Camera: `ImagePicker.requestCameraPermissionsAsync()`
   - Manifest copy (en-GB) is declared in `app.json` under the
     `expo-image-picker` plugin:
     - `photosPermission`: "Allow The Pet Lobby to access your photos so
       you can set a profile picture."
     - `cameraPermission`: "Allow The Pet Lobby to use the camera so you
       can take a profile picture."
2. **Picker tuning.** `quality: 0.7`, `allowsEditing: true`,
   `aspect: [1, 1]`, `mediaTypes: Images`. This keeps file sizes low
   on weak networks and matches the backend's 256×256 thumbnail output.
3. **Client-side size cap.** Reject `> 5 MB` before the network round
   trip. The backend enforces the same cap.
4. **Single-flight upload.** The uploader button is disabled while an
   upload or delete is pending; double-taps cannot trigger two writes.
5. **No raw file path or signed URL is logged.** `describeError` maps
   API codes to human messages; only the code and HTTP status are kept
   in the in-app error toast.
6. **Cache policy.** `expo-image` uses `cachePolicy: 'memory-disk'` on
   the `Avatar` component; rotating signed URLs (TTL 1h) naturally
   invalidate cache entries because the query string changes.

### Backend contract surface

- `POST /me/avatar` — multipart `image`, MIME enforced by **magic
  bytes** (`file-type`), size ≤ 5 MB, dimensions 256–4096px,
  rate-limited 5/min/user, **EXIF stripped** server-side via
  `sharp().withMetadata({})`.
- `DELETE /me/avatar` — idempotent (204).
- `GET /me` — returns `avatarUrl` as a **signed URL** with TTL **1h**.
  The mobile React Query layer should keep `staleTime` at ~50min so
  the URL refreshes before expiry.

### What we explicitly do not do

- We do NOT use Supabase Storage public buckets for avatars.
- We do NOT keep base64 of the image in any persistent store.
- We do NOT upload from background or while the app is offline.
- We do NOT trust the picker-declared MIME for validation — the API
  re-checks via magic bytes.

### Feature flag

`EXPO_PUBLIC_ENABLE_AVATAR_UPLOAD` (boolean, default `false`). When
off, the profile hero renders the read-only `Avatar` component and
no picker is reachable.

Production roll-out checklist:

1. Apply migrations 008 + 009 in the target Supabase project.
2. Confirm bucket `avatars` exists with `public: false`, file_size_limit
   5 MB and RLS policies created by migration 009.
3. Confirm `SUPABASE_SERVICE_ROLE_KEY` is set on the backend
   environment (the backend already requires it for other features).
4. Verify `POST /me/avatar` returns `200` and `GET /me` returns a
   `signedUrl` via curl/Postman against staging.
5. Set `EXPO_PUBLIC_ENABLE_AVATAR_UPLOAD=true` in the mobile build env
   for the next EAS release.
6. Update Data Safety in Play Console: declare **Photos** as collected
   per the rules in `docs/11_SPEC_PRIVACY_DATA_SAFETY.md §11`.

---

## 3. Existing controls (referenced, not redefined)

- Authentication: Supabase JWT exchanged via `useAuth`; never logged.
- Authorization: API enforces ownership on every mutation.
- Network: `fetch` with timeouts (12s standard, 30s avatar upload).
- Transport security: HTTPS only on production builds.
- Crash/analytics: not implemented today; if added, must be re-checked
  against this document and Data Safety.

---

## 4. Open questions

- **Avatar moderation:** at the moment avatars are not scanned for
  abuse. If `MOD_TrustSafety` flags this as a release blocker, plan a
  follow-up (manual review queue, perception hash dedupe, or a
  third-party API) — tracked in `docs/16_RISK_REGISTER.md`.
- **Bucket region:** Supabase project region should be UK/EU per
  privacy stance; confirm before going live with avatars.
