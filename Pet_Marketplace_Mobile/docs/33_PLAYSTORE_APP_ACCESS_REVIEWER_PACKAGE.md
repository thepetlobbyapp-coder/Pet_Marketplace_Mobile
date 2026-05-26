# PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE - The Pet Lobby

**Date:** 2026-05-25
**Status:** safe App Access template for Google Play review.
**Scope:** documentation only. No deploy, no EAS build, no Play Console write,
no remote smoke test, no user creation, no seed and no credential disclosure.

This package is the safe source for filling **Play Console > Policy and
programmes > App content > App access**. Real reviewer credentials must be
entered only in Play Console. Do not commit real email addresses, passwords,
tokens, JWTs, service-role keys, Authorization headers, complete user IDs,
private message text or private report text to this repository.

Checkpoint 083 confirmed the reusable reviewer fixture with
`finalFixtureGo=true`. Checkpoint 084 did not change fixture state and did not
write to Play Console; it keeps App Access operationally ready, with final
Data Safety/Terms submission still blocked on human/legal approval.

Official Google Play basis rechecked on 2026-05-25:
- Prepare your app for review: https://support.google.com/googleplay/android-developer/answer/9859455
- Requirements for providing login credentials for app access: https://support.google.com/googleplay/android-developer/answer/15748846

---

## 1. Play Console Answer

Use this answer for the App Access declaration:

```txt
Some or all functionality is restricted.
```

Reason:
- the app requires authentication for Home, Search, Provider details, Book,
  Chat, Profile and Settings;
- the submitted build should be reviewed with a reusable tutor test account;
- Chat and Trust & Safety review require pre-existing synthetic test data.

---

## 2. Credential Set

Create one reusable reviewer account outside the repository and enter the real
values only in Play Console.

```txt
Instruction name:
The Pet Lobby reviewer tutor account

Username / email:
<PLAY_CONSOLE_TEST_TUTOR_EMAIL>

Password:
<PLAY_CONSOLE_TEST_TUTOR_PASSWORD>
```

Credential requirements before submission:
- account is active, reusable and valid regardless of reviewer location;
- password does not expire during review;
- account is already confirmed if Supabase email confirmation is enabled;
- no one-time password, SMS code, TOTP, passkey or MFA challenge is required
  for this reviewer account;
- account has enough synthetic data to review Home, Search, Provider detail,
  Book, Chat, Profile and account-deletion request entry points;
- account does not contain real user data, real private messages or real
  reports.

If the submitted build includes a provider-only flow that cannot be reached from
the tutor account, add a second credential set in Play Console only:

```txt
Instruction name:
The Pet Lobby reviewer provider account

Username / email:
<PLAY_CONSOLE_TEST_PROVIDER_EMAIL>

Password:
<PLAY_CONSOLE_TEST_PROVIDER_PASSWORD>
```

Do not provide admin, service-role or database credentials in App Access unless
an admin app or admin-only review path is included in the submitted build.

---

## 3. Copy-Ready Reviewer Instructions

Paste and adapt this text in Play Console. Replace placeholders only inside
Play Console.

```txt
Please use the reviewer tutor account provided in this App Access entry.

1. Install and open The Pet Lobby.
2. On the sign-in screen, enter:
   Email: <PLAY_CONSOLE_TEST_TUTOR_EMAIL>
   Password: <PLAY_CONSOLE_TEST_TUTOR_PASSWORD>
3. Tap the sign-in button.
4. After sign-in, review the authenticated tabs:
   - Home: shows the marketplace home and provider cards when test data is available.
   - Search: search and filter providers, then open a provider returned by the API.
   - Provider detail: review the provider profile opened from Search/Home.
   - Book: create or inspect a booking request using the reviewer pet and seeded provider availability.
   - Chat: open the synthetic reviewer conversation, review text-only messages, report controls and block controls.
   - Profile: review account, tutor profile, pets and saved address data, then tap Open Settings to review legal links, sign out and account deletion request/status.
5. No real payment is processed in this phase. Booking values are informational and there is no checkout, card entry or in-app purchase flow.
6. No Android runtime permission is expected for camera, microphone, contacts, files, notifications, SMS or device location in the current build.
7. The app does not use an in-app OTP or MFA flow for this reviewer account. If email confirmation is enabled for new sign-ups, this reviewer account has already been confirmed.
```

---

## 4. Chat And Trust & Safety Review Path

Use only synthetic data for this path. Do not place conversation IDs, message
IDs, report IDs, complete user IDs or private message/report text in Play
Console unless the Play Console form specifically requires it and the data is
safe synthetic test data.

Recommended reviewer path:

```txt
1. Sign in with the reviewer tutor account.
2. Open the Chat tab.
3. Open the synthetic reviewer conversation if it is listed.
4. Review the text-only conversation UI.
5. Open the conversation report control and confirm the available categories.
6. Open the message report control on a synthetic message and confirm the report flow.
7. Open the block confirmation control.
8. If the reviewer submits a block, the app should prevent further sending in that conversation and show a safe blocked-conversation error.
```

Operational note:
- block/report actions can change fixture state; prepare the reviewer fixture so
  it remains reusable or reset it operationally after review;
- do not ask Google reviewers to use real user conversations;
- do not expose private report descriptions or private message content in the
  Play Console notes.

---

## 5. Current Local Evidence

Observed locally for this documentation checkpoint:
- Mobile uses Supabase Auth with email and password.
- Session persistence uses `expo-secure-store` on native builds.
- Authenticated tabs redirect unauthenticated users to Login.
- API calls send Bearer tokens from the active session; token values are not
  documented here.
- `Pet_Marketplace_Mobile/app.json` declares `android.permissions: []`.
- `Pet_Marketplace_Mobile/package.json` does not include a dedicated payment,
  ads, analytics, crash reporting, native maps or native device-location SDK.
- No in-app OTP, SMS, TOTP or MFA screen was found in the Mobile code.
- Supabase project-side email confirmation can affect sign-up; therefore the
  reviewer account must be pre-confirmed before submission.

Observed authenticated areas:
- Home and Search use the authenticated API for provider discovery.
- Provider detail is real when opened from an API provider UUID.
- Book supports real booking requests and explicitly has no payment checkout.
- Chat uses real conversations/messages and Trust & Safety endpoints for
  conversation reports, message reports and block.
- Profile uses account, tutor profile, pets and addresses from the API.
- Settings is reachable from Profile through the Open Settings action and
  contains legal links, account-deletion request status/submission and sign-out.

Known caveats for Play review:
- do not direct reviewers to demo provider IDs or demo booking paths;
- use providers returned by Home/Search from the backend API;
- if Chat review is required, the reviewer tutor account must already have a
  synthetic conversation available;
- Terms/Data Safety final wording still depends on human/legal review.

---

## 6. Repository Safety Rules

Never commit:
- local credential scratch files such as `Credenciais.txt`;
- real reviewer email addresses or passwords;
- Supabase anon/service-role keys;
- JWTs or Authorization headers;
- database URLs;
- complete user, provider, conversation, message, report or block IDs;
- private message text;
- private report descriptions.

Allowed in repository docs:
- placeholders such as `<PLAY_CONSOLE_TEST_TUTOR_EMAIL>`;
- high-level synthetic fixture descriptions;
- safe endpoint names;
- partial IDs only when already approved for historical evidence and not needed
  for App Access.

---

## 7. Remaining Release Gaps

App Access package status:
- safe template prepared;
- Checkpoint 077 exposed the Settings/account-deletion path from authenticated
  Profile and added repository ignore rules for local credential scratch files;
- real Play Console credentials still pending and must be entered only in Play
  Console;
- no Play Console write was executed in this checkpoint.

Still pending outside this package:
- final legal review for bases by purpose;
- detailed retention classes for the up-to-12-month retention policy;
- final Terms/Data Safety for Chat, UGC, reports and block;
- submitted-build smoke to reconfirm the Profile to Settings/account-deletion
  path after the final AAB is produced;
- screenshots/listing reconciliation in `en-GB`;
- EAS build and internal testing track.
