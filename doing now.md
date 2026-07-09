
# Doing Now — Remaining Work

> Comprehensive codebase audit — July 2026
> All 4 web apps (admin, Landing, SuperAdmin, webapp) build clean. Flutter analyze: 0 errors, 0 warnings, 51 info-level hints.

---

## 🔴 Critical — Fix Immediately

### 1. Open Email Relay — `send-notification` Edge Function

**File:** `supabase/functions/send-notification/index.ts`

**Problem:** The function accepts POST from any origin (CORS `*`), reads `to`/`subject`/`body` from the JSON body, and sends email via SMTP — **with zero auth verification**. No `Authorization` header is checked, no JWT validated.

**Impact:** Anyone who discovers the URL can spam/phish through your SMTP.

**Fix:** Add JWT verification matching the pattern in `trigger-mobile-build/index.ts` (extract Bearer token, validate via RPC).

---

### 2. No Org Membership Gate on Auth

**File:** `Mobile/lib/pages/auth_page.dart:37-42`

**Problem:** `signedInBuilder` immediately routes to `/main` for **any** signed-in Clerk user. No check that the user belongs to a valid organization.

**Fix:** After Clerk sign-in, check `user.organizationMemberships`. Route to `/main` only if member of an org; otherwise show "no conference" screen.

---

## 🟠 High — Blocking Production Mobile Builds

### 3. APK Is Debug-Signed

**Files:** `.github/workflows/build-mobile-app.yml`, `Mobile/android/app/build.gradle.kts`

**Problem:** The workflow has **zero `ANDROID_KEYSTORE_*` steps**:
- No `base64 -d` decode of a keystore
- No `ANDROID_KEYSTORE_PATH` / `ANDROID_KEYSTORE_PASSWORD` / `ANDROID_KEY_ALIAS` / `ANDROID_KEY_PASSWORD` env vars or secrets
- `build.gradle.kts` references env vars that are never set in GHA
- The "Verify APK signing" step passes against the **debug certificate** — false confidence

**Fix:** Generate a keystore (`keytool`), store it as `ANDROID_KEYSTORE_BASE64` secret, add decode + signing steps to the workflow.

**Required actions (one-time):**
```bash
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
gh secret set ANDROID_KEYSTORE_BASE64 < upload-keystore.jks
gh secret set ANDROID_KEYSTORE_PASSWORD
gh secret set ANDROID_KEY_ALIAS --body "upload"
gh secret set ANDROID_KEY_PASSWORD
rm upload-keystore.jks
```

---

### 4. VersionCode Always 1

**File:** `.github/workflows/build-mobile-app.yml`

**Problem:** `flutter build apk --release --no-shrink` has **no `--build-number` flag**. The DB column `build_number` exists on `organizations` but is never fetched or passed to the build. Every APK has versionCode=1 from pubspec.yaml (`0.1.0+1`).

**Impact:** Android refuses to install a new APK with the same versionCode as an existing install.

**Fix:** Fetch `build_number` from DB during the branding step, pass `--build-number=${{ steps.config.outputs.build_number }}` to `flutter build apk`.

---

### 5. No `flutter test` in CI Fast-Fail

**File:** `.github/workflows/build-mobile-app.yml`

**Problem:** Fast-fail step only has `flutter analyze`. There is one test file (`Mobile/test/widget_test.dart`, 22 lines, default Flutter template).

**Fix:** Add `flutter test || exit 1` to the fast-fail step. Write real widget/unit tests.

---

### 6. `supabase/config.toml` Doesn't Exist

**Path:** `supabase/config.toml`

**Problem:** Missing entirely. The `supabase/` directory has `migrations/` and `.temp/` but no `config.toml`. This means local Supabase CLI operations (e.g., `supabase start`, `supabase functions serve`) cannot work.

**Fix:** Run `supabase init` in the repo root to generate `supabase/config.toml`.

---

### 7. `mobile-apps` Storage Bucket Never Created

**Problem:** The plan specifies uploading APKs to Supabase Storage (`mobile-apps` bucket, public). The workflow uses GitHub Releases for production builds and `test-builds/` for dry runs — but `test-builds/` is in Storage and the bucket was never created.

**Fix:** Either create the bucket or decide on a delivery strategy:
```bash
supabase storage create mobile-apps --public
```

If keeping GitHub Releases, remove the dead dry-run Storage upload code.

---

### 8. `SECURITY.md` Doesn't Exist

**Path:** `SECURITY.md` (repo root)

**Problem:** The secrets rotation plan (from MOBILE_FULL_PLAN.md Phase 6 Item 9) is not operationalized anywhere outside the planning doc.

**Fix:** Create `SECURITY.md` documenting rotation procedures for `SUPABASE_SERVICE_ROLE_KEY`, `ANDROID_KEYSTORE_*`, `GH_PAT`.

---

## 🟡 Medium

### 9. 51 Info-Level Flutter Issues

| Category | Count | Fix |
|----------|-------|-----|
| `.withOpacity()` deprecated | 30 | Replace with `.withValues(alpha: x)` |
| `.value` on form fields deprecated | 8 | Replace with `initialValue` |
| `use_build_context_synchronously` | 5 | Capture `BuildContext` before `await` or use `if (mounted)` |
| `prefer_const_constructors` | 4 | Add `const` to constructors |
| `library_private_types_in_public_api` | 1 | Use public type or `@internal` annotation |

### 10. Web Build — Large Asset Warnings

**All 4 web apps:** `logo.png` (~1.87 MB) and `icon.png` (~2.74 MB) trigger chunk-size warnings. Optimize or lazy-load these assets.

### 11. GH_PAT Scope Not Verified

**Action:** Check the `GH_PAT` token in GitHub UI — must be scoped to `actions:write` on this repo only (not a classic full-repo token).

---

## ⚪ Not Started (Post-MVP)

| Feature | Plan Phase | Notes |
|---------|------------|-------|
| Push notifications (FCM) | Phase 5 | Requires Firebase project |
| Multi-org scaling (pgmq queue, self-hosted runners) | Phase 6 Item 5 | Documented scaling path |
| Observability dashboard (Datadog/Grafana) | Phase 6 Item 4 | Future, after 2-3 real conferences |

---

## ✅ Completed (This Project)

### Backend / DB
- Migration 014: mobile build columns, `begin_mobile_build`, `set_mobile_build_result`, `get_mobile_build_status`, `resolve_org_slug` updates
- Migration 015: `prev_app_url`, `build_number`, `mobile_build_logs` table, `restore_mobile_build` RPC, `log_mobile_build` RPC, updated `set_mobile_build_result` + `get_mobile_build_status`
- `begin_mobile_build` has 15-min stale-build timeout (idempotency TTL)
- Edge Function `trigger-mobile-build` deployed (proper auth, GH dispatch)

### Admin Panel
- `ApplicationsPage.jsx` with: status display, QR code, trigger/retry/rebuild/restore buttons, branding drift detection, sideload UX copy
- Sidebar "Applications" entry, route wiring
- `backend.js`: `getMobileBuildStatus`, `triggerMobileBuild`, `mobileConfigHash`, `restoreMobileBuild`
- ConferenceBuilderPage success card, HomePage dynamic QR code

### Flutter App
- `clerk_flutter: ^0.0.16-beta` added to pubspec.yaml
- `main.dart`: ClerkAuth wrapper, Supabase init, `resolveOrg` + `getConferenceConfig` + `loadFromService` before `runApp`
- `auth_page.dart`: `ClerkAuthBuilder` with sign-in/out, `tokenProvider` set from `sessionToken`
- `mobile_config.dart`: mutable `static` fields, `loadFromService()` method
- Fixed: const context error, unused fields, dead null-aware expressions, unnecessary null-aware operator

### Build Pipeline
- `.github/workflows/build-mobile-app.yml` with:
  - DB branding fetch (name, logo, theme color)
  - Auto-generated `mobile_config.dart`
  - Custom Android app label + launcher icons
  - `flutter analyze` fast-fail
  - `jarsigner -verify` signing check
  - `dry_run` input mode
  - `set_mobile_build_result` callback on success/failure
  - Per-org concurrency group
  - GitHub Releases upload (production) / Storage upload (dry-run)

### All Web Apps
- admin (1888 modules): ✓ builds clean
- Landing (126 modules): ✓ builds clean
- SuperAdmin (124 modules): ✓ builds clean
- webapp (136 modules): ✓ builds clean
