# Production Readiness Audit (v2)

> Original audit: 2026-07-07 · Revised: 2026-07-07
> Scope: Flutter mobile app, admin backend, Supabase Edge Function, database RPCs, CI/CD workflow, webapp.
> **Status of findings:** All items below are from static code review — file/line references, not runtime-confirmed bugs. Treat "Impact" as "expected impact if the code reads as described"; verify against the live file before shipping a fix, since line numbers drift with every commit.

**What changed from v1:** merged two findings that were really one vulnerability (C12+H4), re-tiered two findings whose blast radius didn't match their label (M6, M7), rewrote the priority list so crash-guaranteed bugs aren't outranked by rare-but-scary races, and split the one vague "wrapper utility" item into a shippable first slice instead of a 40-site rewrite.

---

## 🚨 CRITICAL — Will crash in production, or is a live security hole

### Security (fix before anything else — this is remote code execution, not a crash)

| # | Issue | File:Line | Impact |
|---|-------|-----------|--------|
| **S1** | Unquoted heredoc + unvalidated `org_slug` = shell injection / RCE | `.github/workflows/build-mobile-app.yml:80-105` (heredoc) + `supabase/functions/trigger-mobile-build/index.ts:42` (missing validation) | An org slug or DB field containing backticks/`$()` is interpolated unquoted into a shell heredoc during CI. Quoting the heredoc alone (`<< 'EOF'`) stops *this* injection path, but without input validation on `org_slug` at the edge function, any future string field flowing into the workflow is a fresh RCE vector. **Fix both in the same PR — this was two tickets (C12, H4) in v1 but it's one vulnerability with two layers.** |

### Flutter Mobile App — guaranteed crashes

| # | Issue | File:Line | Impact |
|---|-------|-----------|--------|
| C1 | `parseThemeColor("")` throws on empty `themeColor` | `theme_utils.dart:13`; called from `keynote_speakers.dart:39,81,128` | Empty `MobileConfig.themeColor` → `Color(int.parse("0xff"))` throws `FormatException` on every screen that renders theme color. Crashes on app open for any org with unset branding. |
| C3 | Unsafe `as DateTime` cast on dynamic data | `home_page.dart:132-133`, `presentation_feedback.dart:144` | Any malformed `sortDt`/`time` field (e.g. Supabase returns a string, not a parsed `DateTime`) crashes the whole app with `TypeError`, not just the affected widget. |
| C4 | `session['id'].toString()` on null | `program_page.dart:70` | Missing `id` key on a session map → `NoSuchMethodError`, page crash. |
| C2 | `_authState!` force-unwrap on null | `auth_page.dart:36-76` | If `ClerkAuth.of(context)` returns null (widget tree misconfigured, or Clerk not yet initialized), sign-in crashes instead of showing a retry/error state. |
| C7 | Uncaught exception on question submit | `direct_page.dart:68` | `SupabaseService.submitQuestion()` has no try/catch — any network blip crashes the page mid-interaction. |
| C5 | `setState` after dispose | `resolve_page.dart:47` | Awaiting JWT resolve, then calling `setState` on a possibly-unmounted widget throws. Classic Flutter footgun. |
| C6 | `WebViewController` recreated every build (leak) | `stream_player_page.dart:214-218, 280-283` | New controller instantiated inside `build()` — every `setState()` leaks a WebView instance. Not an instant crash, but a slow-burn OOM on any screen with frequent rebuilds (e.g. a live stream with periodic state updates). |

### Admin Backend — guaranteed crashes / hangs

| # | Issue | File:Line | Impact |
|---|-------|-----------|--------|
| C8 | `this.getStreams()` missing `await` in fallback paths | `backend.js:895, 922` | Assigns a `Promise` (always truthy) instead of the resolved value → `.push()`/`.filter()` on a Promise throws `TypeError`. |
| C9 | RPC response `data` never null-checked (7+ call sites) | `backend.js:155, 295, 498, 619, 766, 972, 1033` | If `org_insert`/`org_update` returns null (RLS denial, constraint violation returning no row, etc.), the next line dereferences `data.start_time`/`data.id` and throws. |
| C10 | `read()` doesn't validate `JSON.parse` output is an array | `backend.js:14` | Corrupted or manually-edited localStorage (`{}` instead of `[]`) crashes every downstream `.push()`/`.filter()` call. |
| C11 | No network timeouts on any RPC call (40+ call sites) | entire `admin/src/backend.js` | A hung Supabase connection hangs the admin UI indefinitely with no user-facing error. High effort — see Priority Fix Order for a scoped first slice. |

### CI/CD Pipeline

| # | Issue | File:Line | Impact |
|---|-------|-----------|--------|
| C13 | Workflow cancellation leaves DB stuck at `building` | `build-mobile-app.yml:191, 210` | `if: success()`/`if: failure()` don't fire on manual cancel → status never clears, blocking retries via the rate limit. |
| C14 | Unchecked curl response in report steps | `build-mobile-app.yml:198-203, 217-222` | `curl -s` swallows HTTP errors → build result silently never reaches the DB → same stuck-`building` symptom as C13, different cause. |
| C15 | Missing env-var validation in Edge Function | `supabase/functions/trigger-mobile-build/index.ts:8-11` | `Deno.env.get("GH_PAT")!` — non-null assertion crashes with an unhelpful 500 if the secret isn't set at deploy time, instead of a clear "misconfigured" error. |

---

## 🔴 HIGH — Data loss, information disclosure, race conditions

| # | Issue | File:Line | Impact |
|---|-------|-----------|--------|
| H1 | TOCTOU race: concurrent `begin_mobile_build` for same org | `014_mobile_app.sql:53-64` | Two parallel requests both observe `not_built` before either writes → two GitHub dispatches → the second build's APK silently overwrites the first's release. Needs near-simultaneous requests to trigger; self-heals on retry, but still a real correctness bug. |
| H3 | Empty APK URL overwrites a previously-valid one | `build-mobile-app.yml:196` | If the release step uploads zero assets, `APK_URL` resolves to `""`, and the DB write sets `mobile_app_url = ""` — destroying a working download link with no assets uploaded to replace it. |
| H2 | `set_mobile_build_result` RPC not try/caught | `trigger-mobile-build/index.ts:96-116` | If the Edge Function can't write the result back to the DB, status is stuck `building` with zero indication of why — compounds C13/C14 rather than being a separate root cause. |
| H5 | `mobile_build_requested_at` not cleared on failure | `014_mobile_app.sql:115-121` | A failed build (which fails fast) still blocks retries for the full 15-minute rate-limit window, punishing users for a build that already errored out. |
| H6 | Branding response errors silently masked | `build-mobile-app.yml:48-50, 59` | `2>/dev/null` + an unchecked `python3 -c "print(d[0])"` — a 4xx/5xx from the Supabase API crashes the parse silently, and the build continues with empty/unset branding variables instead of failing loudly. |
| **M6→H7** | Public `get_mobile_build_status` bypasses RLS, no auth check | `014_mobile_app.sql:127-148` | *Re-tiered from MEDIUM.* `SECURITY DEFINER` with no caller check means anyone can enumerate org slugs and read their build URLs — unauthenticated information disclosure across every org in the system. **"Add an auth check" is not actually the fix — this needs a design decision before any code, not a patch. See Appendix A.** |

---

## 🟡 MEDIUM — Production degradation

| # | Issue | File:Line | Impact |
|---|-------|-----------|--------|
| **M7→M0** | No error boundary around `ConferenceContext` | `webapp/src/context/ConferenceContext.jsx:65-83, 167-169` | *Flagging for re-review, not fully re-tiering without seeing the component tree:* if this context sits above the app shell, a crash in `applyThemeVariables` white-screens every visitor — that's full-outage territory, not "degradation." If it's scoped below the shell (e.g. only the themed sub-tree goes blank), MEDIUM is fair. **5-minute check:** open `webapp/src/App.jsx` and see whether `<ConferenceProvider>` wraps `<App/>`/the router (→ re-tier to CRITICAL, add a top-level error boundary) or wraps only a themed sub-tree (→ MEDIUM stands, boundary can stay local). |
| M1 | `Promise.all` fail-fast loses all partial results | `backend.js:636-639, 1121-1132` | One failed query out of 7 zeroes out the whole dashboard instead of showing 6/7 results. `Promise.allSettled` fixes this outright. |
| M2 | `getDatabaseStats` fetches 10K rows per table just for `.length` | `backend.js:1121-1146` | ~70K rows transferred per dashboard load purely to count them; use a `count`-only query instead. |
| M3 | Polling race: concurrent `loadStatus()` if network > 10s | `ApplicationsPage.jsx:104-111` | Overlapping polls interleave state updates → UI flicker, stale brand-change detection. |
| M4 | State update on unmounted component | `ApplicationsPage.jsx:50-89, 92-115` | No cleanup function on the effect — React warnings now, real leak potential as the component grows. |
| M5 | Side effect inside a React state updater | `ApplicationsPage.jsx:104-111` | Violates updater purity; under StrictMode this double-fires, doubling network calls. |
| M8 | Stale localStorage bleeds across orgs on query failure | `webapp/src/services/localService.js:156-183` | If the Supabase query fails post-auth, the user sees another org's cached brand data instead of an error state — a cross-tenant data leak triggered by a network blip. |
| M9 | `Navigator.pop()` without `mounted` check after await | `Mobile/lib/main.dart:374-378` | Route change while a dialog awaits → `pop()` on a stale context throws. |
| M10 | Unguarded `Timer.periodic` in home_page | `home_page.dart:218-224` | A hung network call inside the 1-minute tick lets the next tick queue another call — pileup under sustained network degradation. |
| **M11 (ex-L13)** | Dynamic SQL built with `schema_name`, which comes from the org's own DB record | `014_mobile_app.sql:96-103` | *Re-tiered from LOW.* This isn't "unvalidated input reaching dynamic SQL" in the abstract — `schema_name` is user-influenced (traces back to the org record), which is the injection shape. If the function uses `format(..., '%I', schema_name)`, `%I` quoting blocks the classic `; DROP TABLE` case, so it's not an open RCE — hence MEDIUM, not CRITICAL. But `%I` alone doesn't validate that `schema_name` is actually one of *your* schemas; it only makes the string safe to interpolate as an identifier. Add an explicit allowlist/lookup check (schema exists in a known table of org schemas) rather than relying on quoting as the only defense. |

---

## ⚪ LOW — Worth knowing, not urgent

| # | Issue | File:Line |
|---|-------|-----------|
| L1 | `crypto.subtle` unavailable on plain HTTP → branding hash fails → `loadStatus()` errors out entirely | `backend.js:1213` |
| L2 | `generateId` collision risk under rapid insertion (1000 random values/ms ceiling) | `backend.js:30-31` |
| L3 | Notifications/questions never persisted to disk — lost on app restart | `admin notif/storage.dart:35-38, 59-61` |
| L4 | Admin question delete never calls the Supabase backend (local-only delete) | `admin notif/admin_questions_page.dart:276-280` |
| L5 | QR API (`api.qrserver.com`) has no `onError` fallback | `HomePage.jsx:314-318` |
| L6 | QR URL may exceed length limits for long `mobileAppUrl` | `HomePage.jsx:315` |
| L7 | Feedback submission errors silently swallowed (`catch (_) {}`) | `presentation_feedback.dart:38` |
| L8 | `??` used on a non-nullable `static const` — dead code, not a bug | `keynote_speakers.dart:30, 72, 119` |
| L9 | `resolve_org_slug` RPC has no `.timeout()` | `supabase_service.dart:80, 189` |
| L10 | DB error detail leaked to caller in Edge Function response | `trigger-mobile-build/index.ts:59` |
| L11 | `--no-shrink` flag → bloated, unoptimized APK | `build-mobile-app.yml:161` |
| L12 | Fragile NULL-id check used as a proxy for "org exists" | `014_mobile_app.sql:136-137` |
Moved to MEDIUM — see M11 below. (Was listed here as LOW in v1.)

---

## Priority Fix Order

Ordered by (severity × likelihood of user-facing harm), not by file layer. Guaranteed crashes on common paths are ranked above rare-but-scary races, since "every user with an unset theme color crashes the app" is worse in practice than "two admins clicking build at the exact same millisecond."

| Priority | Ref | Fix | Layer | Effort |
|----------|-----|-----|-------|--------|
| 1️⃣ | **S1** | Quote the heredoc (`<< 'EOF'`) **and** add `org_slug` validation (alphanumeric + hyphen, length cap) at the edge function boundary — ship together | CI/CD + Edge | ~10 lines |
| 2️⃣ | C1 | Safe default in `parseThemeColor` for empty/malformed input | Mobile | 1 line |
| 3️⃣ | C3 | Replace `as DateTime` with `DateTime.tryParse()` + fallback | Mobile | 2 files |
| 4️⃣ | C4 | Null-guard `session['id']` before `.toString()` | Mobile | 1 line |
| 5️⃣ | C8 | Add missing `await` on `this.getStreams()` | Admin | 2 chars |
| 6️⃣ | C9 | `if (!data) return`/throw guard after every `org_insert`/`org_update` call site | Admin | 7 sites |
| 7️⃣ | H7 (ex-M6) | **Scope first:** grep frontend call sites to find who actually calls this RPC, then either enforce org-membership inside the function (admin-only case) or split it into a status-only public RPC + full-detail admin RPC keyed off an opaque token instead of `org_slug` (public-caller case) — see design note above | DB | scoping session + fix, do this alongside S1 since both hinge on "`org_slug` is not a secret" |
| 8️⃣ | H1 | `SELECT ... FOR UPDATE` (or a conditional `UPDATE ... WHERE status = 'not_built'`) in `begin_mobile_build` | DB | ~3 lines |
| 9️⃣ | C13 | `if: always()` on the report steps so they run on manual cancel, not just success/failure | CI/CD | ~2 lines — independent PR, no dependency on C14/H2 |
| 🔟 | C14 | `--fail` on the curl calls in report steps so HTTP errors abort instead of silently continuing | CI/CD | ~3 lines — independent PR |
| 11 | H2 | Wrap `set_mobile_build_result` RPC call in try/catch inside the Edge Function | Edge | ~5 lines — independent PR |
| 12 | C2 | Null-check `ClerkAuth.of(context)` before force-unwrap | Mobile | 1 check |
| 13 | C11 | **Scoped first slice**, not the full 40-site rewrite: write one `withTimeout()` wrapper, apply to the 5 highest-traffic RPC calls (dashboard load path), track the rest as follow-up tickets | Admin | wrapper + 5 call sites |
| 14 | M0 (ex-M7) | Check `webapp/src/App.jsx`: does `<ConferenceProvider>` wrap the router/app shell? If yes, re-tier to CRITICAL and add a top-level error boundary now, not later. If it only wraps a themed sub-tree, MEDIUM stands. | Webapp | 5-min check, then fix |
| 15 | M11 (ex-L13) | Add an allowlist check on `schema_name` against known org schemas — `%I` quoting alone isn't validation | DB | ~5 lines |

**Not in the top 13, but don't forget:** M1 (`Promise.allSettled`) and M2 (count query instead of full fetch) are both cheap, high-value admin-dashboard fixes worth batching into the same PR as C9 since they touch the same file and same call sites.

---

## Appendix A — H7 design note: why "add an auth check" isn't the fix

`SECURITY DEFINER` + no auth check + keyed only on `org_slug` isn't necessarily a bug that was missed — it may be intentional, built for an unauthenticated caller (e.g. a public "is my app ready yet" widget that shouldn't require login). Bolting a JWT check onto the existing function without knowing which case this is will either leave the hole open or break the feature. Before writing the fix, grep the frontend (`webapp/`, `admin/`) for every call site of `get_mobile_build_status` to determine which fork applies:

- **If every real caller is a logged-in admin:** don't patch the function with an ad-hoc check — make it respect caller identity properly. Either drop `SECURITY DEFINER` and let RLS enforce access, or if it must stay privileged, add an explicit `auth.uid()` → org-membership check inside the function body so it can only ever return the caller's *own* org, regardless of what `org_slug` is passed in.
- **If any real caller is unauthenticated** (public status page, no login): the fix isn't auth — it's narrowing what an unauthenticated call is allowed to see. Two changes, likely both needed:
  1. **Split the RPC.** A public version that takes `org_slug` and returns *only* a status enum (`building`/`ready`/`failed`) — no URL, no other metadata. Keep the full-detail version (including the APK URL) behind real auth, admin-only.
  2. **Stop keying public lookups off `org_slug`.** Slugs are guessable — that's the entire enumeration problem. If a public check is a genuine requirement, issue an opaque per-build token at trigger time and require that token for public lookups instead of the slug.

The reason this belongs in the same scoping session as S1: both bugs come from the same root assumption — *`org_slug` is being treated as if it were secret, and it isn't.* S1 is about what's allowed to flow *into* the slug; H7 is about what the slug is allowed to unlock. Fix the input side (S1) without revisiting this assumption on the output side (H7), and the same flaw just resurfaces here.