# The Pet Lobby - Mobile Design Implementation Brief

**Status:** Operational mobile design brief  
**Date:** 2026-05-19  
**Owner for implementation:** Claude in `Pet_Marketplace_Mobile`  
**Canonical source:** `../../docs/design.md`

This file translates the product design direction into practical mobile implementation notes.

Reference images:

- `../Pet_Marketplace_Mobile01.jpeg` - technical/feature map.
- `../Pet_Marketplace_Mobile02.jpeg` - primary visual direction.
- `assets/pet-lobby-paw-marker-logo.png` - saved logo asset.

---

## 1. Implementation Goal

Replicate the visual direction from `Pet_Marketplace_Mobile02.jpeg` for the mobile app:

- white and light surfaces;
- purple primary brand;
- paw marker logo;
- rounded cards;
- bottom tab navigation;
- category icon chips;
- nearby providers list;
- scheduling flow;
- chat flow;
- community/support-ready structure.

Use `Pet_Marketplace_Mobile01.jpeg` as the functional checklist for all major app areas.

Do not implement unsupported backend behaviour as if it were live.

---

## 2. Brand Assets

Logo saved for implementation reference:

```txt
Pet_Marketplace_Mobile/docs/assets/pet-lobby-paw-marker-logo.png
```

Use it for:

- app icon source/reference;
- splash;
- onboarding header;
- empty states;
- store screenshot mockups.

Keep the logo on white or very light background. Do not stretch, crop, recolour or add heavy shadow.

---

## 3. Mobile Theme Tokens

Create or align theme files around:

```txt
primary      #5B22D6
primaryDark  #3B0D78
primarySoft  #EFE8FF
background   #FAFAFC
surface      #FFFFFF
textPrimary  #111122
textMuted    #5C5C70
border       #E8E8EF
success      #1FA66A
warning      #F5A524
danger       #D92D20
star         #F6B93B
```

Spacing:

```txt
4, 8, 12, 16, 20, 24, 32, 40
```

Radius:

```txt
8, 12, 16, 24, 999
```

Touch targets:

```txt
minimum 44x44
preferred button height 48-52
```

---

## 4. Required Mobile Shell

Bottom navigation:

```txt
Home
Search
Action/Book
Chat
Profile
```

Home layout:

1. Greeting: `Hello, Juliana!`
2. Condominium selector.
3. Notification button.
4. Search input.
5. Service category chips.
6. Purple hero/banner with pet image or illustration.
7. Nearby providers list.
8. Secondary community or booking preview.

Use the main phone screen in `Pet_Marketplace_Mobile02.jpeg` as the visual reference.

---

## 5. Screen Checklist

Claude should map implementation toward these screen groups:

### Auth

- Splash.
- Welcome.
- Login.
- Sign up.
- Password recovery.
- Privacy and Terms links.

### Onboarding

- Choose profile type.
- Tutor profile.
- Provider profile.
- Pet setup.
- Address/condominium setup.
- Provider services and availability.

### Marketplace

- Home.
- Search.
- Filters.
- Provider list.
- Provider detail.
- Schedule service.
- Booking confirmation.

### Bookings And Chat

- Booking list.
- Booking detail.
- Chat.
- Status updates.
- Cancel/complete actions with confirmation.

### Community

- Community feed.
- Nearby providers/map approximation.
- Community notices.
- Report concern.

### Support

- Help centre.
- FAQ.
- Open support request.
- Report user/content.
- Track support status.

### Profile

- User summary.
- Pets/dependants.
- Address/condominium.
- Settings.
- Delete account entry point.

---

## 6. Component Checklist

Create reusable components before screen-specific duplication:

```txt
Button
IconButton
Card
TextInput
SearchInput
Badge
Avatar
CategoryChip
ProviderCard
ServiceCard
BookingSummaryCard
CommunityPostCard
Screen
ScreenHeader
BottomTabs
EmptyState
ErrorState
LoadingState
ConfirmationDialog
RatingStars
```

Rules:

- no text below 12px;
- labels for form inputs;
- visible loading, empty and error states;
- disabled states for buttons;
- accessible icon buttons with labels;
- no token, exact address, phone or coordinates in UI unless explicitly approved and safe.

---

## 7. Visual Patterns To Replicate

From `Mobile02`:

- big logo and wordmark for marketing/onboarding surfaces;
- white phone screens with clean purple CTA;
- category chips below search;
- purple pet-care banner;
- provider cards with avatar, rating, distance and availability;
- schedule screen with provider card, date picker, time chips and summary;
- store screenshot cards with purple backgrounds;
- feature cards with icon, label and short description.

From `Mobile01`:

- profile screens for tutor/provider/admin concepts;
- address form with condominium, block, tower and unit;
- community feed and community map concept;
- booking flow sequence;
- payment flow as future-ready only if backend supports it;
- support, report and reviews sections.

---

## 8. Copy Rules

User-facing copy should be en-GB.

Prefer:

```txt
Find local pet care providers near your community.
Request a booking.
Review profiles and ratings.
Report a concern.
Approximate distance.
```

Avoid:

```txt
Guaranteed safe care.
Fully verified providers.
Licensed by us.
Exact provider location.
```

---

## 9. Security And Privacy Rules

Mobile must not:

- store auth tokens in AsyncStorage;
- log full tokens;
- log private payloads;
- show exact provider coordinates;
- show full address to third parties;
- claim real payment protection before backend support exists;
- call Supabase database directly.

Mobile should:

- use API backend;
- use SecureStore for small secrets;
- keep PII minimal;
- show approximate distance;
- provide report/support entry points;
- use generic errors where payload may include sensitive data.

---

## 10. Play Store Readiness

The app should look complete enough for screenshots:

- no lorem ipsum;
- no dead buttons;
- no fake unsupported claims;
- privacy and terms reachable;
- report/support reachable;
- if account creation exists, an in-app account deletion path and a functional web deletion link are required before release;
- loading, empty and error states present.

Screenshot candidates:

1. Home with provider search.
2. Provider list.
3. Provider detail.
4. Scheduling.
5. Chat.
6. Community/support.

### Play Store Compliance Notes

These notes are implementation guardrails for Claude. Recheck official Google Play sources before release; this document was last checked on 2026-05-19.

Official references:

- Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- App account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- SDK safety: https://support.google.com/googleplay/android-developer/answer/13326895
- Target SDK/API: https://developer.android.com/google/play/requirements/target-sdk
- App Access/login credentials: https://support.google.com/googleplay/android-developer/answer/15748846
- UGC moderation: https://support.google.com/googleplay/android-developer/answer/12923286

Data Safety:

- before release, map every data type collected, shared or processed by the app, backend and SDKs;
- include email, user ID, approximate or precise location if used, chat/messages, reviews and other user-generated content;
- include payments/transactions only if implemented;
- include crash logs, diagnostics and analytics if SDKs collect them;
- keep privacy policy, terms and Play Console declarations consistent with the real implementation.

App Access and login:

- if app review requires login to access functionality, provide reusable demo credentials or access instructions in Play Console;
- do not create real credentials in this document;
- do not write passwords, full tokens or secrets in docs, screenshots or logs.

Account deletion:

- if the app allows account creation, provide an in-app path to request or perform account and associated data deletion;
- provide a functional web link where users can request account/data deletion after uninstalling the app;
- describe retention rules in privacy/terms when data must be retained for legal, security or fraud-prevention reasons.

Android permissions:

- location: request only if necessary, explain the benefit and provide fallback if denied;
- camera/media: request only if photo upload or similar features are implemented;
- notifications: require clear opt-in copy;
- contacts, microphone and SMS: do not use unless a future explicit decision approves the feature and policy impact;
- sensitive permissions require user-facing disclosure and Play Console declaration when applicable.

SDK inventory:

- before release, inventory SDKs for auth, analytics, crash reporting, maps/location, push notifications and payments;
- any collection or sharing by SDKs must be reflected in Data Safety;
- do not add SDKs that collect unnecessary personal data.

UGC and moderation:

- reviews, community, chat and reports require accessible Terms of Use;
- ask users to accept posting/community rules before contributing user-generated content;
- provide report content/user actions where UGC appears;
- provide user blocking where direct user interaction creates safety risk;
- moderation must be continuous and operationally supported;
- do not promise automatic moderation unless it exists.

Audience and Families:

- define target age range before Play Store submission;
- if children are part of the target audience, follow Google Play Families requirements;
- if children are not target users, avoid copy, visuals and onboarding that make the app appear child-directed.

Payments:

- real payment appears only when backend and payment provider support exist;
- do not promise financial protection, custody or refunds unless implemented and operationally supported;
- do not store card data or raw payment tokens in the app;
- any payment feature must match Play Console declarations and store copy.

Target SDK/API:

- before Android release, validate the current Google Play target SDK/API requirement against official sources;
- current reference checked on 2026-05-19: new apps and app updates must target Android 15 / API level 35 or higher from 2025-08-31, except official category exceptions;
- do not change Android configuration from this design brief.

---

## 11. Acceptance Criteria For Claude

- The mobile UI follows `Mobile02` visually.
- Functional coverage follows `Mobile01`.
- Theme tokens are centralised.
- Components are reusable.
- Navigation is clear and bottom-tab based.
- Cards, buttons and chips match the purple/white visual direction.
- States are implemented: loading, empty, error and success.
- No sensitive fields are displayed or logged.
- No backend, database or migration changes are made from mobile work.

---

## 12. Notes For Future Admin

The Admin should not copy the consumer mobile layout directly.

Admin can share:

- brand colours;
- logo;
- typography;
- restrained trust language.

Admin should use a denser operational layout, tables and moderation-focused views.
