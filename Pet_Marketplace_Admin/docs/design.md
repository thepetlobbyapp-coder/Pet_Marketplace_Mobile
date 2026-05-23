# The Pet Lobby - Product Design Direction

**Status:** Canonical design brief  
**Date:** 2026-05-19  
**Scope:** Product-wide visual direction, with Mobile as the primary implementation target  
**Primary implementation owner:** Claude in `Pet_Marketplace_Mobile`  
**Do not use this file as backend or database specification.**

---

## 1. Source Of Truth

This file is the canonical design reference for The Pet Lobby.

Use this document to align:

- mobile product experience;
- future admin visual language;
- store screenshots and product presentation;
- reusable design tokens;
- layout, navigation and component patterns.

The mobile app should use this file together with:

- `Pet_Marketplace_Mobile/Pet_Marketplace_Mobile01.jpeg`
- `Pet_Marketplace_Mobile/Pet_Marketplace_Mobile02.jpeg`
- `docs/assets/pet-lobby-paw-marker-logo.png`
- `docs/09_SPEC_DESIGN_SYSTEM.md`
- `docs/23_PLAYSTORE_DESIGN_POLICY_BRIDGE.md`

`Pet_Marketplace_Mobile02.jpeg` is the primary visual reference.
`Pet_Marketplace_Mobile01.jpeg` is the broader functional map.

---

## 2. Brand

### Name

**THE PET LOBBY**

### Positioning

A hyperlocal pet services marketplace for people, services and community inside a residential area or condominium.

Preferred product message:

```txt
Your pet. Your services. Your community.
```

Avoid overpromising safety or provider certification. The app may communicate trust, moderation and protected payments, but should not claim absolute guarantees.

### Logo

Use the purple paw plus location marker icon as the primary product symbol.

Reference asset:

```txt
docs/assets/pet-lobby-paw-marker-logo.png
```

Usage:

- app icon;
- splash screen;
- auth/onboarding header;
- store listing creative;
- empty states where a friendly branded symbol helps.

Do not distort the icon. Keep it on white or very light surfaces when possible.

---

## 3. Visual Direction

The desired visual style is:

- premium but approachable;
- white/light background;
- strong purple brand moments;
- rounded cards;
- clean mobile-first spacing;
- friendly pet imagery;
- clear marketplace utility;
- calm security cues;
- community-oriented, not corporate.

Use `Pet_Marketplace_Mobile02.jpeg` as the main UI direction:

- large brand/logo area;
- modern phone mockups;
- white surfaces;
- purple primary buttons;
- category icon chips;
- bottom tab navigation;
- nearby provider cards;
- booking and chat flows with simple cards.

Use `Pet_Marketplace_Mobile01.jpeg` as the feature inventory:

- user and provider profiles;
- admin panel concept;
- address registration;
- community feed;
- provider map;
- search and filtering;
- provider list;
- service detail;
- scheduling;
- chat;
- payment;
- reviews;
- help centre;
- reports;
- notifications;
- marketplace extras and subscription.

---

## 4. Colour System

Primary palette:

```txt
brand.purple.900 = #2A0A57
brand.purple.800 = #3B0D78
brand.purple.700 = #4B16A8
brand.purple.600 = #5B22D6
brand.purple.500 = #6F32F0
brand.purple.100 = #EFE8FF
brand.purple.50  = #F7F3FF
```

Neutral palette:

```txt
neutral.950 = #111122
neutral.800 = #262638
neutral.600 = #5C5C70
neutral.400 = #A5A5B5
neutral.200 = #E8E8EF
neutral.100 = #F4F4F8
neutral.50  = #FAFAFC
white       = #FFFFFF
```

Semantic palette:

```txt
success = #1FA66A
warning = #F5A524
danger  = #D92D20
info    = #2563EB
star    = #F6B93B
```

Rules:

- purple is the main action colour;
- do not make every surface purple;
- prefer white cards and purple highlights;
- use green only for availability/success;
- use red only for risk, reports, errors or destructive actions;
- keep contrast WCAG AA where possible.

---

## 5. Typography

Recommended fonts:

- Inter;
- Sora;
- Plus Jakarta Sans;
- system fallback when needed.

Mobile scale:

```txt
display = 30-34
h1      = 26-28
h2      = 20-22
h3      = 17-18
body    = 14-16
caption = 12-13
```

Rules:

- no functional text below 12px;
- labels should remain readable on Android;
- headings should be bold but not cramped;
- use sentence case for most UI labels;
- store/marketing headlines can use stronger weight.

---

## 6. Spacing, Radius And Elevation

Spacing:

```txt
space.1 = 4
space.2 = 8
space.3 = 12
space.4 = 16
space.5 = 20
space.6 = 24
space.8 = 32
space.10 = 40
```

Radius:

```txt
radius.sm = 8
radius.md = 12
radius.lg = 16
radius.xl = 24
radius.pill = 999
```

Elevation:

```txt
shadow.card = subtle, soft, low contrast
shadow.floatingAction = medium, purple-tinted only if tasteful
```

Rules:

- mobile cards should usually use `radius.lg`;
- buttons should use `radius.md` or pill when visually appropriate;
- bottom navigation is flat or lightly elevated;
- avoid heavy shadows.

---

## 7. App Structure

Primary mobile navigation:

```txt
Home
Search
Create/Book action
Chat
Profile
```

The centre action can be a floating plus/action button, matching `Mobile02`.

Core flow:

```txt
Splash
Onboarding/Auth
Profile type setup
Address/condominium setup
Home
Search providers
Provider profile
Schedule service
Booking confirmation
Chat
Booking status
Review
Support/report
```

Community flow:

```txt
Home or Community tab
Community feed
Post/detail
Report concern
Nearby providers/map
```

---

## 8. Screen Layout Map

### Splash

Use:

- white/light background;
- centred paw marker logo;
- app name below or next to logo;
- no noisy illustration.

### Auth And Welcome

Purpose:

- explain app value;
- route to login/signup;
- show privacy/terms links.

Layout:

- logo top;
- short headline;
- 3-5 benefit bullets;
- primary CTA;
- secondary login action;
- store/legal links when relevant.

### Home

Reference: main phone in `Mobile02`.

Content order:

1. greeting with condominium selector;
2. notification icon;
3. search input;
4. category chips;
5. featured pet-care banner;
6. nearby providers;
7. secondary community or bookings preview.

### Search And Filters

Use:

- search bar;
- service category chips;
- filters as rows/cards;
- provider results as vertical cards;
- approximate distance only.

Do not show exact address or coordinates.

### Provider List

Provider card includes:

- avatar;
- display name;
- service headline;
- rating and review count;
- approximate distance;
- availability badge;
- price/from price when backend supports it.

### Provider Detail

Content order:

1. profile summary;
2. rating and reviews;
3. offered services;
4. availability CTA;
5. provider description;
6. report concern action in a low-emphasis position.

### Schedule Service

Reference: secondary phone in `Mobile02`.

Use:

- provider summary card;
- selected service card;
- calendar;
- available time chips;
- booking summary;
- primary button.

### Chat

Use:

- simple message bubbles;
- provider/client header;
- text input;
- optional image preview only if supported;
- report action accessible but not visually dominant.

### Payment

Fase 1 may not implement real payment. If shown in marketing or future design, make it clear and do not imply unsupported payment features.

When implemented later:

- payment summary;
- escrow/custody explanation in plain language;
- status: pending, held, released, refunded;
- no raw payment tokens in UI or logs.

### Community

Use:

- feed cards;
- condominium context;
- posts, alerts, nearby recommendations;
- report/moderation affordances.

### Profile

Tutor:

- personal summary;
- pets/dependants;
- address/condominium;
- payment methods only when supported;
- settings/help.

Provider:

- professional profile;
- services;
- availability;
- portfolio/photos;
- documents/status when supported.

### Support And Reports

Must include:

- Help centre;
- FAQ;
- Open support request;
- Report user/content;
- Track request status.

---

## 9. Component Patterns

### Buttons

Primary:

- purple fill;
- white text;
- height 48-52;
- clear pressed/disabled/loading states.

Secondary:

- white or purple tint surface;
- purple text/border.

Destructive:

- red tone;
- confirmation required for destructive actions.

### Inputs

Rules:

- visible label when the field is not obvious;
- placeholder cannot replace label for complex forms;
- error message near field;
- focus state in purple;
- height 44-52.

### Cards

Use for:

- provider cards;
- service cards;
- booking summaries;
- community posts;
- payment summaries;
- help items.

Card style:

- white surface;
- 1px light border;
- radius 16;
- padding 12-16;
- compact but breathable.

### Category Chips

Use icon plus label:

- Walk/Passeio;
- Pet sitting;
- Transport;
- Boarding;
- More.

Selected chip:

- purple surface or purple border;
- strong visual state.

### Status Badges

Examples:

```txt
Available
Pending
Accepted
Completed
Cancelled
Reported
Blocked
Under review
```

Badges must use text, not colour alone.

---

## 10. Mobile Implementation Notes For Claude

Claude should implement this in `Pet_Marketplace_Mobile`.

Suggested structure:

```txt
src/
  theme/
    colors.ts
    spacing.ts
    typography.ts
    radius.ts
  components/
    ui/
      Button.tsx
      Card.tsx
      TextInput.tsx
      Badge.tsx
      Avatar.tsx
      EmptyState.tsx
      ErrorState.tsx
      LoadingState.tsx
    layout/
      Screen.tsx
      ScreenHeader.tsx
      BottomTabs.tsx
    domain/
      ProviderCard.tsx
      ServiceCard.tsx
      BookingSummaryCard.tsx
      CommunityPostCard.tsx
  features/
    home/
    search/
    bookings/
    chat/
    profile/
    community/
    support/
```

Rules:

- use Expo Router if already chosen by the project;
- keep API calls outside components;
- use SecureStore for tokens, never AsyncStorage;
- do not connect directly to Supabase from the mobile app;
- no hardcoded secrets;
- no real payments until backend support exists;
- do not show exact coordinates or full addresses to third parties.

---

## 11. Play Store Alignment

Store screenshots should communicate:

1. Find nearby providers.
2. View provider profile.
3. Schedule a service.
4. Chat in app.
5. Payment/protection only if actually implemented.
6. Community and support.

Avoid:

```txt
Safe pet care guaranteed.
Fully verified providers.
Licensed and insured by us.
```

Prefer:

```txt
Find local pet care providers near your community.
Review profiles, ratings and booking details.
Request services and chat in the app.
Report concerns and access support.
```

### Play Store Compliance Notes

These notes are design and implementation guardrails for Android release readiness. They do not replace the final Play Console review.

Official policy references must be rechecked before release. Last checked for this document on 2026-05-19:

- Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- App account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- SDK safety: https://support.google.com/googleplay/android-developer/answer/13326895
- Target SDK/API: https://developer.android.com/google/play/requirements/target-sdk
- App Access/login credentials: https://support.google.com/googleplay/android-developer/answer/15748846
- UGC moderation: https://support.google.com/googleplay/android-developer/answer/12923286

Data Safety:

- before any release, map every data type collected, shared or processed by the app, backend and SDKs;
- include email, user ID, approximate or precise location if used, chat/messages, reviews and other user-generated content;
- include payments/transactions only if implemented;
- include crash logs, diagnostics and analytics if SDKs collect them;
- keep privacy policy, terms and Play Console declarations consistent with the real implementation.

App Access and login:

- if reviewable functionality requires login, provide reusable demo credentials or access instructions in Play Console;
- do not store real passwords, full tokens or secrets in this document, screenshots or logs;
- demo access must not depend on a one-time password that expires during review.

Account deletion:

- if the app allows account creation, it must provide an in-app path to request or perform account and associated data deletion;
- a functional web link for account/data deletion must also exist for users who no longer have the app installed;
- privacy/terms must describe retention rules when some data cannot be deleted immediately for legal, security or fraud-prevention reasons.

Android permissions:

- location may be requested only when necessary, with a clear benefit and fallback if denied;
- camera/media permissions may be requested only when photo upload or similar features are implemented;
- notifications must use clear opt-in copy;
- contacts, microphone and SMS must not be used unless a future decision explicitly approves the feature and policy impact;
- sensitive permissions require a clear user-facing disclosure and Play Console declaration when applicable.

SDK inventory:

- before release, inventory SDKs for auth, analytics, crash reporting, maps/location, push notifications and payments;
- any data collection or sharing performed by SDKs must be reflected in Data Safety and privacy docs;
- do not add SDKs that collect unnecessary personal data.

UGC and moderation:

- because the app may include reviews, community posts, chat and reports, Terms of Use must be accessible;
- users should accept posting/community rules before contributing user-generated content;
- report content/user actions must be available where UGC appears;
- user blocking should be available where direct user interaction creates safety risk;
- moderation must be continuous and operationally supported;
- do not promise automatic moderation unless it exists.

Audience and Families:

- define the target age range before publishing;
- if children are part of the target audience, follow Google Play Families requirements;
- if children are not the target audience, avoid store copy, visuals and onboarding that make the app appear child-directed.

Payments:

- real payment must appear only when backend and payment provider support exist;
- do not promise financial protection, custody or refunds unless implemented and supported operationally;
- do not store card data or raw payment tokens in the app;
- any payment feature must match the applicable Play Console declarations and store copy.

Target SDK/API:

- before Android release, validate the current Google Play target SDK/API requirement against official sources;
- current reference checked on 2026-05-19: new apps and app updates must target Android 15 / API level 35 or higher from 2025-08-31, except official category exceptions;
- this design document does not change Android configuration.

---

## 12. Acceptance Criteria

The implemented mobile UI should satisfy:

- visually recognisable as The Pet Lobby;
- follows purple/white brand direction;
- uses the paw marker logo;
- implements safe, readable mobile screens;
- includes loading, empty and error states;
- uses en-GB user-facing text;
- does not expose secrets or sensitive location data;
- does not promise unsupported payment, verification or safety guarantees;
- can be shown in Play Store screenshots without looking like a placeholder.

---

## 13. Open Decisions

- Whether the Mobile app uses one root tab group or separate tutor/provider shells.
- Whether community is a main tab or secondary home section.
- Whether payment appears in MVP or stays documented as future-ready.
- Final copy for App Store / Play Store screenshots.
- Final production app icon export sizes.
