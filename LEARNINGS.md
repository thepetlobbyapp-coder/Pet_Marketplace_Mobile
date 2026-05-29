# Learnings

## 2026-05-27

- The backend dev deployment is healthy, but `/api/v1/health` does not prove the
  exact git SHA remotely.
- EAS `appVersionSource: remote` means the final Android version code is managed
  remotely and should not be inferred only from local `app.json`.
- `EXPO_PUBLIC_*` values are bundled into the Mobile app and must be treated as
  public client config, never secrets.
- A public postcode lookup to `postcodes.io` is a privacy/data-safety concern
  because postcode and request metadata are handled by a third party.
- Logout must clear in-memory query cache to reduce account-switch and local PII
  exposure.
- `@supabase/supabase-js` 2.106.1 can introduce tracing code that Hermes rejects
  in this Expo Android release bundle; Auth-only Mobile usage can avoid that by
  depending directly on `@supabase/auth-js`.
- A successful EAS build is not enough for Play submission when the built bundle
  lacks required public runtime config or legal pages are inconsistent with the
  store/app brand.
