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
- Legacy active providers created before the base-address publish invariant are
  repaired by data migration, not by weakening the marketplace RPC. The repair
  backfills `base_address_id` only from the provider owner's own geocoded
  address; any remaining active listing without a valid own geocoded base
  address is moved to `paused`. `providers_list_near` stays strict and
  radius-gated; `providers_get_one` stays unfiltered for booking detail.

## 2026-05-29

- The marketplace keeps excluding the requesting user's own provider listing.
  If a tutor/provider account cannot see its own advert, that is expected; use a
  second tutor account or remove category filters for visibility smoke.
- Address matching continues to use postcode-centroid coordinates only. Street,
  house number or free-form area labels do not affect distance after postcode
  lookup has produced latitude/longitude.
- Users may delete their own saved addresses, including the tutor default
  address. If the deleted address was the default, the tutor must set another
  default address before marketplace discovery is available again.
- Users may not delete the base address of an active provider listing. The API
  returns `409 CONFLICT` and the app asks the user to pause the provider listing
  first, preserving the publish invariant and preventing radius-discovery
  regressions.
- A service is the unit of account: one tutor "hire" (one booking) is one
  service and one review, regardless of the number of hours, and is never
  counted per slot or per day. The hours of a service must be a single
  contiguous block (e.g. `09:00,10:00,11:00`); scattered slots are rejected in
  both the Node DTO and the `create_booking_with_slots` RPC.
- Ratings are 1-5 with no comment in this phase, tutor -> provider only, one per
  booking and editable (upsert). Dropping free text keeps the UGC/moderation
  surface minimal for Play Store and avoids reopening Data Safety scope beyond a
  numeric rating.
- Proof of service is a handshake: the provider marks the booking `completed`
  (delivery) and the tutor confirms (`tutor_confirmed_at`), which is the future
  escrow-release hook. Review unlocks when the booking is `completed` and either
  the tutor confirmed or 2 days have elapsed since the service date (lazy
  auto-release, no cron). The provider can never review and is never offered the
  rating CTA.
- The provider rating aggregate (`provider_profiles.rating_average`/
  `rating_count`) is recomputed inside `submit_review` over `visible` reviews
  only, serialized per provider with `select ... for update` to prevent lost
  updates under concurrent reviews.
- `reviews.reviewer_user_id` is never serialized to clients; review responses
  expose only id, booking, rating, status and timestamps (UK GDPR
  forbidden-fields contract).
- User-facing reporting of a review is out of scope for this phase: it would
  require extending `report_target_type` (currently `conversation`/`message`).
  Phase 1 moderation is admin-only hide (`status = hidden_by_admin`), which
  triggers an aggregate recompute.
- Google Play: real-world pet-care services are exempt from Google Play Billing,
  so the app can ship with no payment and add an external processor later
  without Play Billing. The rating feature itself does not block submission; it
  only adds a numeric user-generated rating to the Data Safety scope.
