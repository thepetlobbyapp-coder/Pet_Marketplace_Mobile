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

## 2026-05-28

- Provider availability is weekly slot-based (`weekday` + `timeSlotId`) instead
  of free-form date ranges for this phase, matching the existing 1-hour booking
  grid.
- Multi-hour care requests are one grouped booking with child `booking_slots`,
  while legacy `bookings.time_slot_id` remains as the first slot for existing
  Admin/Mobile compatibility.
- Booking values are stored as GBP estimates (`price_per_hour_snapshot` and
  `estimated_total_amount`) only. The app still does not process payment,
  checkout, custody, refunds or financial protection.
- A tutor default address is a precondition for marketplace discovery. Distance
  stays postcode-centroid to postcode-centroid (privacy-safe, not door-to-door).
- Marketplace discovery filters by each provider's own `service_radius_km`
  (a provider only appears when its radius covers the requesting tutor). The
  radius filter lives in `providers_list_near` only; `providers_get_one` stays
  unfiltered so the booking flow remains reachable.
- Publishing a provider listing (`status = active`) requires a base address;
  without one the publish is rejected and the profile stays `paused`.
- `/me` exposes tutor address presence as the boolean `hasDefaultAddress` only.
  Address identifiers (`default_address_id`, `base_address_id`) and coordinates
  are never serialized to clients (UK GDPR forbidden-fields contract).
