# PLAYSTORE_FINAL_SCREENSHOTS_READINESS - The Pet Lobby

**Date:** 2026-05-26
**Checkpoint:** 087
**Status:** GO COM RESSALVAS for future EAS build preparation; final
`en-GB` screenshots recaptured after the real sanitized Home greeting; no EAS,
no deploy, no Play Console write, no remote write and no fixture change.
**Scope:** final screenshot readiness for Login, Home, Search, Provider Detail,
Book, Chat, Profile and Settings/account deletion after Checkpoint 086.

This document is sanitized. It does not contain reviewer credentials, complete
emails, passwords, tokens, Authorization headers, full IDs, private reports or
private message text.

---

## 1. Verdict

| Target | Verdict | Conditions |
|---|---|---|
| Final `en-GB` screenshot set | GO | Use the Checkpoint 087 files captured from the current local Mobile build. |
| Future EAS build artifact | GO COM RESSALVAS | Build later only; repeat smoke on the exact signed build before Play Console use. |
| Play Console submission | NO-GO in this checkpoint | Final Data Safety, legal basis and retention answers still require human/legal approval. |

No remote creation, reset, booking submission, message send, report submit,
block/unblock action or account-deletion request was performed during this
checkpoint.

---

## 2. Evidence Read

Docs:

- `docs/PROGRESS.md`
- `docs/36_PLAYSTORE_REVIEW_FIXTURE_CONFIRMATION.md`
- `docs/38_PLAYSTORE_FINAL_SCREENSHOTS_READINESS.md`

Mobile implementation:

- `Pet_Marketplace_Mobile/app/(tabs)/home.tsx`
- `Pet_Marketplace_Mobile/app/(tabs)/search.tsx`
- `Pet_Marketplace_Mobile/app/provider/[id].tsx`
- `Pet_Marketplace_Mobile/app/(tabs)/book.tsx`
- `Pet_Marketplace_Mobile/app/(tabs)/chat.tsx`
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`
- `Pet_Marketplace_Mobile/app/(tabs)/settings.tsx`
- `Pet_Marketplace_Mobile/src/api/client.ts`
- `Pet_Marketplace_Mobile/src/api/types.ts`
- `Pet_Marketplace_Mobile/src/i18n/en-GB.ts`

Checkpoint 083 remains the fixture source of truth and records
`finalFixtureGo=true`. Checkpoint 084 remains the legal/Data Safety guardrail:
Play Console final is still blocked on human/legal approval.

---

## 3. Capture Environment

- Expo Web ran locally at `http://localhost:8082`.
- The published backend API base was provided as a process override for
  `localhost:8082` CORS compatibility.
- The existing local Supabase configuration was used for authentication.
- The previous browser session had expired, so the reviewer login was renewed
  through the local credential guardrail in memory only; no credential, token or
  Authorization header was printed or persisted.
- Browser viewport: `390x844`; exported PNG files: `780x1688`.
- Screenshot directory:
  `Pet_Marketplace_Mobile/docs/playstore-screenshots/checkpoint-087/`.

---

## 4. Screenshot-Safe Matrix

| Screen | Artifact | Evidence | Safety verdict |
|---|---|---|---|
| Login | `01-login-en-gb.png` | Empty credential fields; only placeholder email text is visible. | GO |
| Home | `02-home-en-gb.png` | Authenticated Home shows `/me.profiles.tutor.displayName` after sanitization, neutral `Care workspace`, and a provider returned by the API. | GO |
| Search | `03-search-en-gb.png` | Search shows the provider returned by the API and no demo/non-UUID route. | GO |
| Provider Detail | `04-provider-detail-en-gb.png` | Opened from the real API provider route; the full route UUID is not visible in the screenshot. | GO |
| Book | `05-book-en-gb.png` | Real provider booking screen is visible with a saved synthetic pet and available slots; booking was not submitted. | GO |
| Chat | `06-chat-en-gb.png` | Synthetic chat thread is visible with report/block controls; no message, report or block action was submitted. | GO |
| Profile | `07-profile-en-gb.png` | Cropped/scroll position avoids a complete email and shows synthetic profile details. | GO |
| Settings/account deletion | `08-settings-account-deletion-en-gb.png` | Account deletion status/entry point is visible; no deletion request was submitted. | GO |

Screenshot caveats:

- These are Expo Web/browser captures, not screenshots from a signed AAB or a
  physical Android device.
- Future EAS/internal-track use must repeat smoke against the exact submitted
  build.
- Profile and Chat rely on the approved synthetic reviewer fixture.
- Avatar upload, camera, gallery/media and permission-dependent flows were not
  opened or captured.

---

## 5. Home Welcome Confirmation

- Home calls `getMe(accessToken)` and prefers
  `/me.profiles.tutor.displayName`.
- The displayed value passes the Home sanitizer: whitespace collapse, complete
  email rejection, complete UUID rejection, credential/token-like rejection and
  length cap.
- Local smoke confirmed `/home` with a personalized greeting present when the
  tutor display name resolved.
- The same screen showed no `Garden Flats`, complete email, complete UUID,
  bearer/JWT/token text or credential text.
- Loading/error/no tutor profile states still fall back to neutral `Hello`.

---

## 6. Commands and Results

| Command | Exit | Result |
|---|---:|---|
| `pnpm typecheck` in `Pet_Marketplace_Mobile` | 0 | TypeScript passed. |
| `pnpm lint` in `Pet_Marketplace_Mobile` | 0 | ESLint passed. |
| `git diff --check` | 0 | Passed; existing LF/CRLF normalization warnings only. |
| Home scan for `demoTutor.firstName`, `demoTutor`, `Garden Flats`, `CondoSelector` | 1 | No matches in Home, as expected. |
| Mobile pt-BR visible-copy scan | 0 | Matches were only false positives such as English `Tutor profile`; no pt-BR visible copy found in the screenshot slice. |
| Mobile prohibited-claims scan | 0 | No prohibited claims in app copy; docs matches are guardrail/prohibited-claim examples only. |
| Secrets/PII scan on Home and changed docs | 0 | No token, Authorization header, secret, complete UUID or private credential found; placeholder email text remains only on Login. |

Browser smoke also confirmed:

- Home route `/home`.
- Personalized sanitized welcome present when `/me` resolves.
- API provider shown from the published backend.
- No complete email, complete UUID, bearer/JWT/token or credential text visible
  in the captured Home/Search/Provider/Book/Chat/Settings screens.
- Profile screenshot was captured after scrolling to avoid showing a complete
  email.

---

## 7. Claims Guardrails

Allowed screenshot/listing posture:

- Marketplace discovery and booking request preparation.
- In-app chat with report/block controls.
- Account-deletion request path/status.
- Synthetic UK reviewer fixture only.

Not allowed without a new compliance review:

- Guaranteed care, guaranteed provider quality, guaranteed availability or
  guaranteed acceptance.
- Verified, DBS-checked, background-checked, insured or licensed providers.
- Protected payments, escrow, refunds, chargebacks, deposits, card processing,
  subscriptions or in-app purchases.
- Automatic moderation, 24/7 moderation, automatic account deletion,
  automatic anonymisation or instant destructive deletion.
- Avatar upload, camera, gallery/media or permission-dependent screenshots.

---

## 8. Remaining Gaps

- Final human/legal sign-off from Checkpoint 084 remains open for legal bases
  by purpose and retention classes by data type.
- Final Play Console Data Safety answers must be reviewed against the exact
  EAS build before submission.
- A signed build/internal track smoke must verify the same flows after EAS.
- Account deletion, report review and privacy/support operational ownership
  must remain explicitly assigned before final production submission.

---

## 9. Next Step

Recommended next step:

`Future EAS build preparation only after confirming the Checkpoint 087 package
and the Checkpoint 084 human/legal blockers are compatible.`

Conditions:

- Do not run EAS until explicitly requested.
- Keep Play Console real writes out of scope.
- If any build/smoke path requires remote fixture mutation, stop and ask for
  the literal authorization before proceeding.
