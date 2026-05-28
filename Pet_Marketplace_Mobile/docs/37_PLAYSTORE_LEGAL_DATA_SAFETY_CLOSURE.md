# PLAYSTORE_LEGAL_DATA_SAFETY_CLOSURE - The Pet Lobby

**Date:** 2026-05-26
**Checkpoint:** 084
**Status:** GO COM RESSALVAS for final screenshots; GO COM RESSALVAS for
future EAS build preparation only; NO-GO for final Play Console submission
until the human/legal blockers below are approved.
**Scope:** compliance/readiness and documentation validation only. No EAS
build, no deploy, no Play Console write, no remote write and no fixture change.

This document is sanitized. It does not contain reviewer credentials, complete
emails, passwords, tokens, Authorization headers, full IDs, private message
text or private report text.

---

## 1. Verdict

| Target | Verdict | Conditions |
|---|---|---|
| Final Store Listing screenshots | GO COM RESSALVAS | Use only the Checkpoint 083 reviewer fixture with `finalFixtureGo=true`; use real providers returned by the API; keep screenshots in `en-GB`; do not show credentials, complete IDs, real PII, private messages, report text, demo/non-UUID provider routes, avatar upload, camera or photo-library flows. |
| Future EAS build artifact | GO COM RESSALVAS | Technical build preparation may continue later, but this checkpoint did not run EAS. Re-run smoke on the exact submitted build and keep Play Console credentials outside the repo. |
| Play Console Data Safety / internal track submission | NO-GO until human/legal sign-off | Do not submit final Data Safety/Terms declarations until legal bases by purpose and retention classes are approved and the final Play Console answers are reviewed against the exact build. |

Operationally, the next safe step is final screenshot preflight/capture from the
fixture-backed build path, not Play Console submission.

---

## 2. Evidence Read

Local evidence:

- `docs/10_SPEC_PLAYSTORE_RELEASE.md`
- `docs/11_SPEC_PRIVACY_DATA_SAFETY.md`
- `docs/30_PLAYSTORE_RELEASE_READINESS.md`
- `docs/31_PLAYSTORE_HUMAN_DECISION_PACKAGE.md`
- `docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md`
- `docs/34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md`
- `docs/35_PLAYSTORE_REVIEW_FIXTURE_READINESS.md`
- `docs/36_PLAYSTORE_REVIEW_FIXTURE_CONFIRMATION.md`
- `docs/PROGRESS.md`
- `Pet_Marketplace_Mobile/app.json`
- `Pet_Marketplace_Mobile/package.json`
- `Pet_Marketplace_Back/src/legal/legal.pages.ts`

Checkpoint 083 fixture state:

- `docs/36_PLAYSTORE_REVIEW_FIXTURE_CONFIRMATION.md` records
  `finalFixtureGo=true`.
- The reusable reviewer fixture has Login, profile, pet, default UK address,
  real provider detail by UUID, booking readiness, one conversation, one
  message, closed prior reports, no current blocks by/against reviewer and
  account-deletion state cleared.

Implementation facts relevant to Data Safety:

- `android.permissions` is `[]`.
- The Mobile package has no dedicated ads, analytics, crash reporting, payment,
  maps or native device-location SDK.
- Native photo picker dependency and avatar-upload UI are present for optional
  profile pictures; `microphonePermission: false` keeps the Expo public config
  at `android.permissions: []`. The exact generated manifest still needs to be
  checked before Play submission.
- Public legal pages are conservative: they describe account/auth data,
  profiles, pets, addresses, provider search, bookings, chat messages,
  reports/block, Supabase/DigitalOcean processing, no sale of personal data, no
  in-app payment and request-based account deletion.

Official references rechecked on 2026-05-26:

- Google Play Data Safety:
  https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play User Data:
  https://support.google.com/googleplay/android-developer/answer/9888076
- Google Play account deletion:
  https://support.google.com/googleplay/android-developer/answer/13327111
- Google Play UGC policy:
  https://support.google.com/googleplay/android-developer/answer/9876937
- Google Play UGC moderation requirements:
  https://support.google.com/googleplay/android-developer/answer/12923286
- ICO lawful basis:
  https://ico.org.uk/for-organisations/advice-for-small-organisations/getting-started-with-gdpr/data-protection-principles-definitions-and-key-terms/
- ICO storage limitation:
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/

---

## 3. Legal / Data Safety Matrix

| Data class | Data Safety position | Purpose | Third parties / processors | Retention / deletion state | Legal status |
|---|---|---|---|---|---|
| Email/account identifier | Collected | Account creation, login, support, account deletion | Supabase Auth/infrastructure; no sale/ads sharing documented | Deletion request available in app and web; exact retention class pending | Legal basis by purpose pending |
| Password/session token | Processed for auth; never document values | Authentication and session security | Supabase Auth; app stores session securely on device | Do not log or retain values in docs/repo | Security handling documented; legal basis final pending |
| User/Auth ID, role, locale, status | Collected | Account, authorization, audit and safety | Backend/Supabase/DigitalOcean processing | May be retained for legal, safety, fraud, disputes or audit within approved high-level window | Legal basis by purpose pending |
| Tutor/provider profile | Collected when provided | Marketplace account and provider discovery | Backend/Supabase/DigitalOcean processing | User can request deletion; exact class and exception rules pending | Legal basis by purpose pending |
| Pets | Collected | Booking/service coordination | Backend/Supabase/DigitalOcean processing | User can request deletion; exact class pending | Legal basis by purpose pending |
| Address/postcode/public area/coordinates entered by user | Collected; classify location carefully | Proximity search, default address and booking readiness | Backend/Supabase/DigitalOcean processing | User can request deletion; exact class pending | Legal basis by purpose pending; precision classification must be checked in Play Console |
| Provider search, provider detail and approximate distance | Collected/processed | Discovery and matching | Backend/Supabase/DigitalOcean processing | Operational/audit retention class pending | Legal basis by purpose pending |
| Bookings | Collected | Booking request and service coordination | Backend/Supabase/DigitalOcean processing | May need dispute/legal/safety retention up to the approved high-level window; exact class pending | Legal basis by purpose pending |
| Chat text messages | Collected if Chat is in the submitted build | Service communication and support/safety review when reported | Backend/Supabase/DigitalOcean processing; no media attachments documented | Exact retention class pending; do not promise automatic deletion | Legal basis and Terms/Data Safety final pending |
| Reports and block state | Collected if Trust & Safety is in the submitted build | Safety, abuse reporting, user control, moderation workflow | Backend/Supabase/DigitalOcean processing; admin/API review | Reset/runbook exists for reviewer fixture; production retention class pending | Legal basis and UGC/Terms final pending |
| Account deletion requests | Collected | Process deletion requests and verify ownership/handling | Backend/Supabase/DigitalOcean processing | Request-based deletion only; no automatic destructive deletion job documented | Safe to claim request path; do not claim automatic deletion |
| Technical logs/diagnostics | Limited; no dedicated crash/analytics SDK observed | Security and operational diagnosis | Hosting/infrastructure logs may exist | Minimize PII; retention class pending if logs contain personal data | Legal basis/retention class pending |
| Payments, cards, bank data, subscriptions, IAP | Not collected in current phase | Not applicable | None in submitted scope | Not applicable | Do not claim payment protection or checkout |
| Ads ID, behavioural ads, contacts, device location permission, audio, chat media, file access | Not collected in current declared scope | Not applicable | None observed in Mobile package/config | Not applicable | Re-review if SDKs/permissions/features change |
| Camera/photo library/avatar upload | Collected only when the user chooses a profile picture | Profile personalisation | Native picker/upload UI present; backend stores in private `avatars` bucket and returns signed URLs | Re-review exact manifest, Privacy and Data Safety before submission | Include only if screenshots/listing claims match the submitted build |

Data Safety posture:

- Declare collected data only for the exact build submitted.
- Declare encryption in transit through HTTPS.
- Disclose deletion request paths in app and web.
- Do not claim automatic destructive deletion, automatic anonymisation or
  instant deletion.
- Disclose infrastructure processors and keep Privacy Policy consistent with
  Play Console answers.
- Do not sell personal data or imply advertising use.

---

## 4. Account Deletion

Current safe claim:

- Users can request account deletion in app and through the public web link.
- The request path is available from Profile > Open Settings and from the
  public `/account-deletion` URL.
- The backend records and exposes request/status flows.

Prohibited claim:

- Do not claim automatic account deletion, instant destructive deletion,
  automatic anonymisation or immediate account deactivation. The current system
  is request-based and still needs final operational/legal execution rules.

---

## 5. UGC / Chat / Reports / Block

Current safe claim:

- Chat is text-only when included in the submitted build.
- Report and block controls exist for the validated Chat 1:1 Trust & Safety
  slice.
- No media attachments, public reviews, realtime/push/offline queue or
  automatic moderation are part of this release claim.

Remaining legal requirement:

- Terms/Data Safety must describe text messages, reports, block, prohibited
  behaviour, review process and user-control expectations without promising
  automatic moderation or 24/7 review.

---

## 6. Store Listing Claims

Allowed, only if the exact submitted build still supports them:

- Pet care marketplace experience.
- Email/password sign-in.
- Search/open providers returned by the backend API.
- Provider profile review.
- Booking request/inspection without in-app payment.
- Profile, pets and saved address management.
- Settings/legal links/account-deletion request path.
- Text-only service conversations, if Chat is included.
- Report/block controls for Chat, if the validated Trust & Safety slice is
  included.

Prohibited:

- Guaranteed care, guaranteed availability, guaranteed acceptance or guaranteed
  provider quality.
- `100% verified`, background-checked, DBS-checked, insured or licensed
  providers unless a reviewed operational process exists.
- Payment protection, escrow, refunds, chargebacks, deposits, card processing,
  subscriptions or in-app purchases.
- Veterinary advice, diagnosis, emergency care or medical outcomes.
- Exact user location exposure or exact provider address exposure.
- Automatic moderation, 24/7 moderation, automatic account deletion, automatic
  anonymisation or instant destructive deletion.
- Public reviews, ratings collection or provider onboarding as complete flows
  unless present in the submitted build.
- Google Play ranking, awards, user testimonials, download counts, price
  promotions, `best`, `#1`, `top`, `free`, `download now`, `install now` or
  similar promotional language.
- Child-directed language, imagery or positioning.
- Avatar upload, camera or photo-library flows without a fresh permissions and
  Data Safety review.

---

## 7. Human Gaps Remaining

These are not engineering guesses and must be approved by the responsible human
owner/legal reviewer before final Play Console submission:

1. Legal basis per purpose for account/auth, marketplace, provider search,
   bookings, chat, support, safety, fraud, deletion requests and operational
   logs.
2. Retention classes for account data, profile data, pets, addresses,
   bookings, chat messages, reports/block state, deletion requests and logs,
   including which classes may remain up to 12 months.
3. Final Terms and Privacy text for UGC/chat/report/block and account deletion.
4. Final Play Console Data Safety answers against the exact submitted build.
5. Operational owner and timing for account-deletion handling, report review
   and support/privacy inbox monitoring.
6. Play Console country/region selection if England is not an isolated option.

---

## 8. Next Step

Recommended next checkpoint:

`Checkpoint 085 - Final en-GB screenshots from the validated reviewer fixture`

Scope for that checkpoint:

- No EAS unless explicitly requested after screenshots.
- No Play Console write.
- Use the Checkpoint 083 fixture only.
- Re-run Mobile typecheck/lint, secret/PII scans and claim scans.
- Capture Login, Home/Search, Provider Detail, Book, Chat, Profile and
  Settings/account deletion states from the exact fixture-backed build path.
- If any screenshot requires remote write, stop and request the literal fixture
  authorization before writing.

Do not proceed to final Play Console Data Safety/internal-track submission until
the human gaps in section 7 are closed.
