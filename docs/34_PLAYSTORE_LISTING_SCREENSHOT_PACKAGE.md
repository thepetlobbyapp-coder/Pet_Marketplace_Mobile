# PLAYSTORE_LISTING_SCREENSHOT_PACKAGE - The Pet Lobby

**Date:** 2026-05-25
**Status:** proposed Store Listing copy and screenshot runbook for `en-GB`.
**Scope:** documentation only. No deploy, no EAS build, no Play Console write,
no remote smoke test, no user creation, no seed and no credential disclosure.

This package prepares the Store Listing and screenshot route. It is not final
legal, privacy or product copy. Checkpoint 079 reconciled visible copy for the
critical Mobile screenshot screens to `en-GB`; final screenshots still depend
on the submitted build and an approved reusable synthetic fixture.

Checkpoint 083 confirmed the reusable reviewer fixture with
`finalFixtureGo=true`. Checkpoint 084 keeps final screenshots at GO COM
RESSALVAS under the rules in this package and
`docs/37_PLAYSTORE_LEGAL_DATA_SAFETY_CLOSURE.md`; Play Console/Data Safety
final submission remains blocked until legal bases by purpose and retention
classes are approved.

Real App Access credentials remain separate and must be entered only in Play
Console. Use `docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md` for App Access.

Official Google/Android basis rechecked on 2026-05-25:
- Store listing fields and limits: https://support.google.com/googleplay/android-developer/answer/9859152
- Preview assets and screenshots: https://support.google.com/googleplay/android-developer/answer/9866151
- Data Safety form: https://support.google.com/googleplay/android-developer/answer/10787469
- Account deletion requirements: https://support.google.com/googleplay/android-developer/answer/13327111
- Google Play icon design specifications: https://developer.android.com/google-play/resources/icon-design-specifications

---

## 1. Local App Facts

Observed from `Pet_Marketplace_Mobile/app.json` and package metadata:

| Field | Current value |
|---|---|
| App name | `The Pet Lobby` |
| Android package | `app.thepetlobby.mobile` |
| Version | `0.1.0` |
| Android versionCode | `2` |
| Orientation | Portrait |
| Initial Play track target | Internal testing, then later production only after review |
| Android permissions | `[]` in `app.json` |
| EAS production build type | `app-bundle` |

Important caveat:
- The current Mobile surface includes optional avatar changes through camera or
  photo library. Do not use avatar upload screenshots or listing claims unless
  permission copy, Data Safety and submitted-build behaviour are reviewed
  against the exact AAB.

---

## 2. Proposed Store Listing Copy

All copy below is **copy proposta / proposed copy**, not final legal text.

### App Name

```txt
The Pet Lobby
```

Notes:
- within Google Play's 30-character app name limit;
- do not append ranking, price, locality spam or promotional terms.

### Short Description

```txt
Find local pet care providers and manage bookings.
```

Notes:
- within Google Play's 80-character short description limit;
- avoids unproved claims such as guaranteed care, verified providers or
  protected payments.

### Full Description

```txt
The Pet Lobby helps pet owners in England find local pet care providers, review
provider profiles, request bookings and manage service conversations when Chat
is included in the submitted build.

Use Profile and Settings to manage account details, pets, saved address
information, legal links and account deletion requests.

No in-app payment is processed in this phase. Booking information is used for
service coordination and does not include checkout, card entry or in-app
purchases.
```

Submission note:
- this full description remains preliminary until final Terms, Privacy and Data
  Safety are reviewed for the exact build submitted.

---

## 3. Allowed Claims

Allowed only when the submitted build still supports the described behaviour:

- The app is a pet care marketplace experience.
- Users can sign in with email and password.
- Users can search and open providers returned by the backend API.
- Users can review provider profile information shown by the app.
- Users can request or inspect bookings without real in-app payment.
- Users can manage profile, pets and saved address information.
- Users can open Settings from Profile.
- Users can access legal links from Settings.
- Users can request account deletion in-app and through the public web link.
- Users can use text-only service conversations if Chat is included in the
  submitted build.
- Users can report/block Chat conversations only if the submitted build includes
  the Trust & Safety flow validated up to Checkpoint 074.

---

## 4. Prohibited Claims

Do not use any of these in listing copy, screenshots, captions, feature graphic,
App Access notes or reviewer instructions:

- Guaranteed care, guaranteed provider quality, guaranteed acceptance or
  guaranteed availability.
- `100% verified`, background-checked, DBS-checked, insured or licensed
  providers unless a reviewed operational process exists.
- Payment protection, escrow, refunds, chargebacks, deposits, card processing,
  subscriptions or in-app purchases.
- Veterinary advice, diagnosis, emergency care or medical outcomes.
- Exact user location exposure or exact provider address exposure.
- Automatic moderation, 24/7 moderation, automatic account deletion,
  automatic anonymisation or instant destructive deletion.
- Public reviews, ratings collection or provider onboarding as complete flows
  unless present in the submitted build.
- Google Play ranking, awards, user testimonials, download counts, price
  promotions, `best`, `#1`, `top`, `free`, `download now`, `install now` or
  similar promotional language.
- Child-directed language, imagery or positioning.

---

## 5. Screenshot Data Rules

Every screenshot must follow these rules:

- No real full email address.
- No password, token, JWT, Authorization header, API key, service-role key,
  database URL, `.env` value or internal credential scratch file.
- No complete user, provider, booking, conversation, message, report or block
  IDs.
- No private real message text.
- No private real report text or report description.
- No real user data and no real provider data.
- Use only approved synthetic fixtures for tutor, pet, provider, booking and
  Chat data.
- Do not show `Credenciais.txt`, `.env`, logs, terminal output, Play Console,
  Supabase, DigitalOcean, EAS, admin tools or other internal tooling.
- Do not show demo/fallback provider IDs as if they were production data.
- Do not show avatar upload, camera or photo-library flows until that surface is
  re-reviewed for permissions and Data Safety.

If the app UI necessarily displays an email or identifier, use an approved
synthetic non-real reviewer fixture and prefer a crop/state that avoids exposing
the full value in public Store Listing screenshots.

---

## 6. Screenshot Runbook

Target: phone portrait screenshots for the Google Play phone device section.
Google Play allows up to 8 screenshots per supported device type. Final images
must depict the current submitted build. If large-screen screenshots are added
later, follow the separate Google Play large-screen size/aspect requirements.

Current status after Checkpoint 081:
- Login, Sign-up, Reset password, Home, Search, Provider detail and Book had
  their visible Mobile copy reconciled to `en-GB` for the primary screenshot
  path. Final screenshots must still come from the exact submitted build and
  approved synthetic fixture.
- Local Browser preflight was unblocked in Checkpoint 081 by starting Expo Web
  on `http://localhost:8083` with a cleared Metro cache. Login, Sign-up, Reset,
  Home, Search, Provider detail and Book rendered locally in safe `en-GB`
  states. Treat this as local preflight evidence only, not final screenshot
  evidence.

### Shot 1 - Login

Goal:
- show the signed-out entry point and app identity.

Capture state:
- empty email/password fields, or approved synthetic reviewer fields only if
  needed for the Play Console flow;
- no visible real email, password manager suggestion, OTP, token or debug data.

Current caveat:
- final capture still depends on the submitted build and safe reviewer fixture;
  do not show real credentials or password manager suggestions.

### Shot 2 - Home/Search

Goal:
- show provider discovery using authenticated API data.

Capture state:
- signed in as approved synthetic tutor;
- Home or Search with provider cards returned by the backend API;
- no `DEMO SEED`, no demo-only provider IDs, no real provider data.

Current caveat:
- Home/Search copy is reconciled to `en-GB`, but screenshots must still use
  providers returned by the backend API and avoid demo/non-UUID routes.

### Shot 3 - Provider Detail

Goal:
- show a provider profile opened from Home/Search.

Capture state:
- open a provider using a UUID returned by the backend API;
- show safe public profile fields only;
- do not show complete IDs, private contact details, exact address or real
  provider data.

Do not:
- open a non-UUID demo provider route for Store Listing screenshots.

### Shot 4 - Book Without Real Payment

Goal:
- show booking request flow without checkout.

Capture state:
- use approved synthetic tutor, pet, provider and availability;
- show booking selection/summary or a pre-approved synthetic booking state;
- make clear through the app state that no checkout/card/payment is involved.

Do not:
- show card fields, payment SDKs, transaction claims or real booking data;
- create/reset remote fixture state during this checkpoint.

### Shot 5 - Chat With Synthetic Data

Goal:
- show text-only service conversation and Trust & Safety controls if included.

Capture state:
- approved synthetic conversation only;
- approved synthetic message text designed for screenshots;
- report and block controls visible if the build includes them.

Do not:
- show real private messages, report descriptions, complete conversation/message
  IDs or a blocked state that cannot be reset for review.

### Shot 6 - Profile

Goal:
- show account/profile management without exposing real account data.

Capture state:
- approved synthetic tutor profile, pet and address data;
- avoid full email visibility where possible; if unavoidable, use only an
  approved non-real synthetic account.

Do not:
- show real email, real address, precise coordinates, real pet/user data or
  internal IDs.

### Shot 7 - Profile > Open Settings

Goal:
- prove Settings/account deletion/legal links are reachable from Profile.

Capture state:
- Profile screen with the `Open Settings` action visible;
- no real email, full ID or sensitive account data in the frame.

### Shot 8 - Settings / Account Deletion / Legal Links

Goal:
- show legal links and account deletion request/status entry points.

Capture state:
- Settings with Legal links and Account deletion area visible;
- no actual destructive deletion claim;
- no submitted deletion request unless the synthetic fixture is resettable.

Do not:
- claim account deletion is instant or automatic;
- show private support data or operational notes.

---

## 7. Asset Notes

For the Play Store listing:
- app icon: provide the Play icon separately at 512x512 PNG per Google Play
  requirements;
- feature graphic: prepare 1024x500 JPEG or 24-bit PNG with no misleading
  ranking, price, badge or testimonial content;
- screenshots: use current submitted app UI, avoid extra text overlays unless
  necessary and keep any taglines small and non-promotional.

This checkpoint did not generate final screenshots, feature graphics, icons or
an EAS build.

---

## 8. Remaining Gaps Before Store Listing Submission

- Verify the submitted build still shows `en-GB` on Login, Sign-up, Reset,
  Home, Search, Provider detail and Book before final screenshot capture.
- Reuse `http://localhost:8083` or restart Expo Web with a cleared Metro cache
  for future local visual preflight; final Store Listing screenshots must still
  be confirmed on the submitted build/device.
- Confirm reusable synthetic fixture for Login/Home/Search/Provider/Book/Chat/
  Profile/Settings screenshots.
- Confirm final Terms and Data Safety for Chat, reports and block.
- Confirm bases by purpose and detailed retention classes through human/legal
  review.
- Produce final screenshots from the exact build/environment submitted.
- Keep real App Access credentials only in Play Console.
- Run EAS/internal track only in a later checkpoint.
