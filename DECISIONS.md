# Decisions

## 2026-05-27

- Supabase direct usage in Mobile is allowed only for Auth/session.
- Sensitive domain operations must go through the backend `/api/v1` with bearer
  auth.
- Mobile production runtime must not silently default to localhost.
- Demo fixtures must not be reachable in production by default.
- Android permissions should remain empty unless a future feature explicitly
  reopens permission, privacy and Data Safety review.
- EAS build and Play submission require separate literal gates and must still
  honor preflight, artifact smoke and compliance checks.
- Play submission remains conditional even when the gate is authorized; a failed
  preflight or compliance blocker must stop submission.
- Do not submit the current Android AAB to Play while production Auth public
  config is absent and the account deletion page brand is inconsistent.
