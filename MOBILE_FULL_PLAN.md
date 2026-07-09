# Mobile App — Full Implementation Plan

> Based on current codebase audit (July 2026)

---

## Current State Summary

### ✅ Fully Done (Backend)
| Component | File |
|-----------|------|
| `mobile_build_status` column on orgs | `014_mobile_app.sql` |
| `begin_mobile_build()` RPC — validates admin JWT, prevents double-builds | `014_mobile_app.sql` |
| `set_mobile_build_result()` RPC — GitHub Actions callback | `014_mobile_app.sql` |
| `get_mobile_build_status()` RPC — admin polling with auth check | `014_mobile_app.sql` |
| `trigger-mobile-build` Edge Function (v1 deployed) | `supabase/functions/trigger-mobile-build/index.ts` |
| `resolve_org_slug` returns `mobile_app_url` + `theme_color` | `014_mobile_app.sql` |

### 🟡 Partially Done (Flutter App)
| Component | Status | File |
|-----------|--------|------|
| `SupabaseService` — full CRUD for org schemas | ✅ Wired | `Mobile/lib/services/supabase_service.dart` |
| Org resolution flow (`resolveOrg`, `setOrgSlug`) | ✅ Wired | `Mobile/lib/services/supabase_service.dart` |
| Conference config, sessions, speakers, notifications fetchers | ✅ Wired | `Mobile/lib/services/supabase_service.dart` |
| UI pages (home, program, live, profile, settings, notifications) | ✅ Built | `Mobile/lib/pages/*.dart` |
| `mobile_config.dart` — branding constants | 🟡 Hardcoded | `Mobile/lib/mobile_config.dart` |
| Auth page | 🟡 Demo (`admin/admin`) | `Mobile/lib/pages/auth_page.dart` |
| Supabase JWT via Clerk | ❌ Not wired | `SupabaseService.tokenProvider` is null |

### ❌ Not Started
| Component | Notes |
|-----------|-------|
| `.github/workflows/build-mobile-app.yml` | Flutter build pipeline |
| Clerk Flutter SDK integration | Real auth instead of demo |
| Admin panel "Build Mobile App" button + status | New page in `admin/` app |
| Admin panel "Applications" sidebar entry | New route |
| QR code / download link in admin panel | UI component |
| Push notifications (FCM) | After MVP |
| Flutter app branding from build-time config | Generated during CI/CD |

---

## Architecture Overview

```
Admin Panel (web)
  └─ "Build Mobile App" button
       └─ calls trigger-mobile-build Edge Function
            ├─ begin_mobile_build() RPC (validates admin)
            └─ GitHub Actions workflow_dispatch
                 └─ build-mobile-app.yml
                      ├─ Fetches org config from DB (name, logo, colors)
                      ├─ Injects into Flutter build (assets, constants)
                      ├─ flutter build apk --release
                      └─ Uploads APK + calls set_mobile_build_result()
                           └─ mobile_app_url saved to organizations table

Flutter App (after download)
  ├─ Opens → fetches org config via resolve_org_slug
  ├─ Clerk auth → Supabase JWT → signed requests
  ├─ Fetches events, sessions, speakers, notifications
  └─ Displays branded experience
```

---

## Phase 1: Real Auth (Clerk Flutter SDK)

**Goal:** Replace hardcoded `admin/admin` auth with Clerk sign-in.

### Steps

1. **Add Clerk Flutter package** to `pubspec.yaml`:
   ```yaml
   dependencies:
     clerk_flutter: ^1.0.0
   ```

2. **Create auth service** at `Mobile/lib/services/auth_service.dart`:
   ```dart
   class AuthService {
     // Initialize Clerk with publishable key
     // Sign in / sign up methods
     // Returns JWT token for SupabaseService.tokenProvider
   }
   ```

3. **Wire `tokenProvider`** in `main.dart`:
   ```dart
   SupabaseService.tokenProvider = () async {
     final session = ClerkAuth.session;
     return session?.getToken();
   };
   ```

4. **Update `auth_page.dart`** — replace hardcoded form with Clerk's built-in UI or custom form using Clerk API.

5. **Org membership check** — after login, check `user.organizationMemberships`:
   - If member of an org → route to main app
   - If not → show "no conference" screen

### Dependencies
- `clerk_flutter` (or `clerk_auth` / custom Clerk REST calls)
- `flutter_dotenv` (already in `pubspec.yaml`? Not yet — `supabase_service.dart` imports it)
- `supabase_flutter` (already imported)

### Security
- Clerk handles auth → produces JWT
- JWT passed to Supabase via `accessToken` callback
- All RPCs use `auth.jwt()` for authorization
- Service role NEVER used on mobile

---

## Phase 2: GitHub Actions Build Pipeline

**Goal:** When admin clicks "Build", it produces a branded APK automatically.

### New file: `.github/workflows/build-mobile-app.yml`

```yaml
name: Build Mobile App
on:
  workflow_dispatch:
    inputs:
      org_slug:
        description: "Organization slug"
        required: true

# Prevent two builds for the same org from racing each other
concurrency:
  group: mobile-build-${{ github.event.inputs.org_slug }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: "3.x"

      - name: Decode signing keystore
        run: |
          printf '%s' "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > android/app/upload-keystore.jks
        working-directory: Mobile

      - name: Fetch org config from Supabase
        id: config
        run: |
          curl -s "$SUPABASE_URL/rest/v1/rpc/resolve_org_slug" \
            -H "apikey: $SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
            -H "Content-Type: application/json" \
            -d '{"p_slug": "${{ inputs.org_slug }}"}' \
            > org_config.json
          echo "name=$(jq -r '.name' org_config.json)" >> $GITHUB_OUTPUT
          echo "logo=$(jq -r '.logo_url' org_config.json)" >> $GITHUB_OUTPUT
          echo "color=$(jq -r '.theme_color' org_config.json)" >> $GITHUB_OUTPUT
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

      - name: Generate mobile_config.dart
        run: |
          cat > Mobile/lib/mobile_config.dart << EOF
          class MobileConfig {
            static const String appName = '${{ steps.config.outputs.name }}';
            static const String themeColor = '${{ steps.config.outputs.color }}';
            static const String orgSlug = '${{ inputs.org_slug }}';
          }
          EOF

      - name: Download logo + generate launcher icons
        run: |
          curl -s "${{ steps.config.outputs.logo }}" -o Mobile/assets/app_logo.png
          flutter pub get
          flutter pub run flutter_launcher_icons:main
        working-directory: Mobile

      - name: Build signed APK
        run: flutter build apk --release
        working-directory: Mobile
        env:
          ANDROID_KEYSTORE_PATH: android/app/upload-keystore.jks
          ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          ANDROID_KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}

      - name: Upload APK to Supabase Storage
        id: upload
        run: |
          # Generate a unique file name to avoid collisions
          FILENAME="app-${{ inputs.org_slug }}-${{ github.run_id }}.apk"
          curl -s -X POST "$SUPABASE_URL/storage/v1/object/mobile-apps/$FILENAME" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
            -H "Content-Type: application/octet-stream" \
            --data-binary "@Mobile/build/app/outputs/flutter-apk/app-release.apk"
          echo "url=$SUPABASE_URL/storage/v1/object/public/mobile-apps/$FILENAME" >> $GITHUB_OUTPUT
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

      - name: Call set_mobile_build_result (success)
        run: |
          curl -s "$SUPABASE_URL/rest/v1/rpc/set_mobile_build_result" \
            -H "apikey: $SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "p_org_slug": "${{ inputs.org_slug }}",
              "p_success": true,
              "p_app_url": "${{ steps.upload.outputs.url }}",
              "p_error": null
            }'
```

### GitHub Secrets Needed
| Secret | Source |
|--------|--------|
| `SUPABASE_URL` | Supabase project settings |
| `SUPABASE_ANON_KEY` | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings |
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 upload-keystore.jks` output (one-time generation) |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password you chose at generation |
| `ANDROID_KEY_ALIAS` | Key alias you chose at generation |
| `ANDROID_KEY_PASSWORD` | Key password (usually same as keystore password) |

### Prerequisites

1. **Wire release signing in `android/app/build.gradle.kts`** — one-time Flutter change:

   ```kotlin
   signingConfigs {
       create("release") {
           val keystorePath = System.getenv("ANDROID_KEYSTORE_PATH")
           if (keystorePath != null) {
               storeFile = rootProject.file(keystorePath)
           }
           storePassword = System.getenv("ANDROID_KEYSTORE_PASSWORD")
           keyAlias = System.getenv("ANDROID_KEY_ALIAS")
           keyPassword = System.getenv("ANDROID_KEY_PASSWORD")
       }
   }
   buildTypes {
       release {
           signingConfig = signingConfigs.getByName("release")
       }
   }
   ```

   Without this, `flutter build apk --release` silently signs with the debug keystore.

2. **Create the Supabase Storage bucket** — one-time setup:
   ```bash
   supabase storage create mobile-apps --public
   ```

3. **Generate + store the signing keystore** — never commit to repo:
   ```bash
   keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA \
     -keysize 2048 -validity 10000 -alias upload
   base64 -w0 upload-keystore.jks | gh secret set ANDROID_KEYSTORE_BASE64
   gh secret set ANDROID_KEYSTORE_PASSWORD
   gh secret set ANDROID_KEY_ALIAS
   gh secret set ANDROID_KEY_PASSWORD
   rm upload-keystore.jks
   ```

---

## Phase 3: Admin Panel — Build Button + Status

**Goal:** Admin can see build status and trigger a new build.

### New page: `admin/src/pages/ApplicationsPage.jsx`

```jsx
function ApplicationsPage({ slug }) {
  const [status, setStatus] = useState(null);
  const [building, setBuilding] = useState(false);

  // On mount, poll get_mobile_build_status every 5s
  useEffect(() => {
    const poll = setInterval(async () => {
      const s = await sa.getMobileBuildStatus(slug);
      setStatus(s);
    }, 5000);
    return () => clearInterval(poll);
  }, []);

  const handleBuild = async () => {
    setBuilding(true);
    await sa.triggerMobileBuild(slug);
    // Polling will pick up "building" → "ready" automatically
  };

  return (
    <div>
      <h2>Mobile Application</h2>
      {status?.status === "not_built" && (
        <button onClick={handleBuild} disabled={building}>Build Mobile App</button>
      )}
      {status?.status === "building" && <Spinner />}
      {status?.status === "ready" && (
        <>
          <QRCode value={status.app_url} />
          <a href={status.app_url}>Download APK</a>
          <p style={{ color: "#666", fontSize: 14, marginTop: 8 }}>
            Android will show a safety warning when installing outside the
            Play Store. This is normal — tap "Install anyway" to proceed.
          </p>
          <button onClick={handleBuild}>Rebuild</button>
        </>
      )}
      {status?.status === "failed" && (
        <>
          <p>Build failed: {status.error}</p>
          <button onClick={handleBuild}>Retry</button>
        </>
      )}
    </div>
  );
}
```

### Files to modify

| File | Change |
|------|--------|
| `admin/src/pages/ApplicationsPage.jsx` | **New file** — build button, status, QR code |
| `admin/src/backend.js` | Add `getMobileBuildStatus()`, `triggerMobileBuild()` |
| `admin/src/adminConfig.js` | Add "Applications" to sidebar nav |
| `admin/src/App.jsx` | Add route `/c/:orgSlug/admin/app/applications` |
| `Landing/src/pages/ConferenceBuilderPage.jsx` | Add success card pointing to Admin → Applications |
| `webapp/src/pages/HomePage.jsx` | Show download section only if `mobileAppUrl` exists |

---

## Phase 4: Replace Static Config with Backend Data

**Goal:** `MobileConfig` values come from the DB, not hardcoded constants.

### In Flutter app, on launch:

```dart
// After auth, before showing main UI:
await SupabaseService.resolveOrg(slug);
final config = await SupabaseService.getConferenceConfig();

// Apply branding
MobileConfig.appName = config["name"];
MobileConfig.themeColor = config["themeColor"];
// ... etc
```

Actually, `MobileConfig` is currently a `const` class — it needs to become mutable or be replaced with a runtime config object.

### Files to modify

| File | Change |
|------|--------|
| `Mobile/lib/mobile_config.dart` | Change from `static const` to `static` (mutable) |
| `Mobile/lib/main.dart` | Call `SupabaseService.resolveOrg()` + `getConferenceConfig()` before `runApp()` |
| `Mobile/lib/services/supabase_service.dart` | `getConferenceConfig()` already exists ✅ |
| `Mobile/lib/pages/*.dart` | Already use `MobileConfig.*` — will pick up values ✅ |

### Launch flow (new)

```
App opens
  ├─ Check SharedPreferences for saved slug
  ├─ If found → resolveOrg() + getConferenceConfig() → apply branding → show main UI
  └─ If not → show splash/setup screen → enter slug or scan QR → save → resolve → main UI
```

---

## Phase 5: Push Notifications (Post-MVP)

**Not in MVP** — but architecture is:

1. Add `firebase_messaging` to Flutter app
2. Create a Firebase project (Cloud Messaging only, no Auth/DB needed)
3. Flutter registers device token → calls `register_device_token` RPC
4. New table `device_tokens` per org schema: `id, user_clerk_id, token, platform`
5. `send-notification` Edge Function extended to also call FCM API
6. FCM delivers to device even when app is closed

---

## Phase Dependencies

```
Phase 1 (Auth) ─── no deps
Phase 2 (Build pipeline) ─── no deps
Phase 3 (Admin panel) ─── needs Phase 2
Phase 4 (Branding) ─── needs Phase 1
Phase 5 (Push) ─── needs Phase 1 + Phase 4
```

**Recommended order:** Phase 2 → Phase 1 → Phase 3 → Phase 4 → Phase 5

---

## What to Start With First

If I were doing this tomorrow:

1. **GitHub Actions workflow** (Phase 2) — zero code changes, one YAML file + set secrets. Gives you a working signed APK on your phone immediately.

   **Do first:** generate the keystore, store in GitHub secrets, then create the workflow. Skip the private-repo GitHub Releases trap — upload to Supabase Storage instead.

2. **Auth page** (Phase 1) — Clerk Flutter SDK, real login instead of hardcoded demo. This unlocks the rest of the mobile experience.

3. **Admin build button** (Phase 3) — then you can trigger builds from the web panel instead of the Actions tab.

4. **Branding** (Phase 4) — then the APK actually shows the org's name, logo, and colors at runtime.

5. **Push notifications** (Phase 5) — requires Firebase project (Cloud Messaging only). Last priority.

### One-time audit items (do before go-live)

| Item | Action |
|------|--------|
| **GH_PAT scope** | Verify `trigger-mobile-build`'s PAT is scoped to `actions:write` on this repo only, not a classic full-repo token |
| **Storage bucket public?** | Confirm `mobile-apps` bucket is public so QR codes work for attendees |
| **Service role key in GHA** | Acceptable for solo dev (manual trigger only). Revisit with scoped build tokens if team expands |

---

## Phase 6: Operational Hardening (v1.1 — after 2-3 real conferences)

**Goal:** Make the build pipeline survivable for on-call engineers at 2am. This is not pre-MVP work — ship Phase 2 + Phase 3 first, then harden against real failure modes.

### Why Post-MVP?

Every item here solves a problem that *might* happen at scale. Building them all upfront risks over-engineering against failure modes that may not manifest the way you expect. After shipping 2-3 real conferences, the actual pain points will tell you which of these to prioritize.

---

### Architecture (A+) Items

#### 1. Idempotency TTL — `begin_mobile_build()`

**Problem:** If a GHA runner crashes mid-build (network loss, OOM, runner recycle), the org's status stays permanently stuck on "building." No future builds can start.

**Fix:** Allow a new build if the existing "building" row is older than 20 minutes (the GHA default timeout).

**SQL change:**

```sql
CREATE OR REPLACE FUNCTION begin_mobile_build(p_org_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_org RECORD;
  v_status TEXT;
  v_updated_at TIMESTAMPTZ;
BEGIN
  -- Must be admin or super_admin
  IF NOT (SELECT is_admin_or_super()) THEN
    RAISE EXCEPTION 'Not authorized' USING HINT = 'admin or super_admin role required';
  END IF;

  SELECT mobile_build_status, mobile_app_url, updated_at
    INTO v_org
    FROM public.organizations
    WHERE slug = p_org_slug;

  v_status    := v_org.mobile_build_status;
  v_updated_at := v_org.updated_at;

  -- Allow if NOT building OR the build is stale (>20 min old, likely crashed)
  IF v_status = 'building' AND v_updated_at > now() - interval '20 minutes' THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', 'A build is already in progress (started ' || v_updated_at || ')'
    );
  END IF;

  UPDATE public.organizations
    SET mobile_build_status = 'building',
        mobile_app_url = NULL
    WHERE slug = p_org_slug;

  RETURN jsonb_build_object(
    'ok', true,
    'status', 'building'
  );
END;
$$;
```

#### 2. Rollback Slot

**Problem:** If a rebuild ships a broken APK (crashes on launch, missing features), there's no way to revert an org to the last-known-good `mobile_app_url` without rebuilding from scratch.

**Fix:** Before overwriting `mobile_app_url`, save the old value to a `prev_app_url` column. Expose a `restore_mobile_build()` RPC that swaps them back.

**Migration change (`015_mobile_rollback.sql`):**

```sql
ALTER TABLE public.organizations
  ADD COLUMN prev_app_url TEXT;

-- Update set_mobile_build_result to save previous URL before overwriting
CREATE OR REPLACE FUNCTION set_mobile_build_result(
  p_org_slug TEXT,
  p_success BOOLEAN,
  p_app_url TEXT DEFAULT NULL,
  p_error TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_old_url TEXT;
BEGIN
  SELECT mobile_app_url INTO v_old_url
    FROM public.organizations
    WHERE slug = p_org_slug;

  IF p_success THEN
    UPDATE public.organizations
      SET mobile_build_status = 'ready',
          prev_app_url = COALESCE(v_old_url, prev_app_url),
          mobile_app_url = p_app_url,
          updated_at = now()
      WHERE slug = p_org_slug;
  ELSE
    UPDATE public.organizations
      SET mobile_build_status = 'failed',
          mobile_app_url = p_app_url, -- keep old URL if build failed? No — set to null so org doesn't show stale APK
          updated_at = now()
      WHERE slug = p_org_slug;
  END IF;

  -- Return full status for admin panel
  RETURN jsonb_build_object(
    'ok', true,
    'status', CASE WHEN p_success THEN 'ready' ELSE 'failed' END,
    'app_url', CASE WHEN p_success THEN p_app_url ELSE NULL END,
    'error', CASE WHEN p_success THEN NULL ELSE p_error END
  );
END;
$$;

-- New RPC: restore previous build
CREATE OR REPLACE FUNCTION restore_mobile_build(p_org_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_prev_url TEXT;
  v_cur_url  TEXT;
BEGIN
  IF NOT (SELECT is_admin_or_super()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT mobile_app_url, prev_app_url
    INTO v_cur_url, v_prev_url
    FROM public.organizations
    WHERE slug = p_org_slug;

  IF v_prev_url IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'No previous build to restore');
  END IF;

  UPDATE public.organizations
    SET mobile_app_url = v_prev_url,
        prev_app_url = v_cur_url,
        mobile_build_status = 'ready',
        updated_at = now()
    WHERE slug = p_org_slug;

  RETURN jsonb_build_object(
    'ok', true,
    'app_url', v_prev_url,
    'previous_app_url', v_cur_url
  );
END;
$$;
```

**Admin panel UI change:** Add a "Restore Previous Build" button to `ApplicationsPage.jsx` when `prev_app_url` is non-null. Place it next to "Rebuild" with a confirmation dialog:

```jsx
{status?.prev_app_url && (
  <button onClick={handleRestore} style={{ color: '#d32f2f', marginLeft: 8 }}>
    ↺ Restore Previous Build
  </button>
)}
```

#### 3. VersionCode Strategy

**Problem:** Every APK needs a unique, monotonically increasing `versionCode` (Android requirement). Currently not tracked.

**Fix:** Derive `versionCode = 10_000 + build_number` where `build_number` is the `mobile_build_status.id` (auto-incrementing PK on a new `mobile_build_logs` table — see observability item below).

Alternative (simpler): Store a `build_number` column directly on `organizations` that increments on each successful build:

```sql
ALTER TABLE public.organizations
  ADD COLUMN build_number INTEGER DEFAULT 0;

-- In set_mobile_build_result on success:
-- build_number = build_number + 1
```

Pass the `versionCode` to the GHA workflow via the org config fetch step, then inject it during the Flutter build:

```yaml
- name: Inject versionCode
  run: |
    # In build.gradle.kts, read from env var
    echo "FLUTTER_BUILD_NUMBER=${{ steps.config.outputs.build_number }}" >> $GITHUB_ENV
```

In `android/app/build.gradle.kts`:

```kotlin
defaultConfig {
    versionCode = System.getenv("FLUTTER_BUILD_NUMBER")?.toIntOrNull() ?: 1
    versionName = "1.0.${versionCode}"
}
```

For the `flutter build apk --release` command:

```yaml
- name: Build signed APK
  run: flutter build apk --release --build-number=${{ steps.config.outputs.build_number }}
```

#### 4. Observability — Build Logs Table

**Problem:** When a build fails, there's no record of *why* beyond the current status. No metrics on build duration, failure rate, or failure patterns across orgs. An on-call engineer has zero data to debug with.

**Fix:** New table `mobile_build_logs`:

```sql
CREATE TABLE public.mobile_build_logs (
  id BIGSERIAL PRIMARY KEY,
  org_slug TEXT NOT NULL,
  status TEXT NOT NULL, -- 'building', 'ready', 'failed'
  duration_seconds INTEGER,
  error_message TEXT,
  app_url TEXT,
  build_number INTEGER,
  triggered_by TEXT, -- clerk user ID
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RPC to insert a log row (called by GHA and trigger-mobile-build)
CREATE OR REPLACE FUNCTION log_mobile_build(
  p_org_slug TEXT,
  p_status TEXT,
  p_duration_seconds INTEGER DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL,
  p_app_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_build_number INTEGER;
BEGIN
  UPDATE public.organizations
    SET build_number = COALESCE(build_number, 0) + 1
    WHERE slug = p_org_slug
    RETURNING build_number INTO v_build_number;

  INSERT INTO public.mobile_build_logs
    (org_slug, status, duration_seconds, error_message, app_url, build_number, triggered_by)
  VALUES
    (p_org_slug, p_status, p_duration_seconds, p_error_message, p_app_url, v_build_number,
     COALESCE(current_setting('request.jwt.claims', true)::json->>'sub', 'system'));

  RETURN jsonb_build_object('ok', true, 'build_number', v_build_number);
END;
$$;
```

**Future observability (post-v1.1):**
- Export `mobile_build_logs` to Datadog / Grafana via Supabase webhook + Edge Function
- Dashboard: build success rate over time, average build duration per org, failure reasons
- Alert: if 3 consecutive builds for the same org fail, notify the admin

#### 5. Multi-Org Scaling Note

**Problem:** With 500+ orgs all triggering builds, the per-org concurrency group (`mobile-build-${{ org_slug }}`) prevents races per-org but does nothing to serialize or queue across orgs — they'd all hit `ubuntu-latest` simultaneously, exhausting GHA parallel job limits.

**Fix (documented scaling path, not built yet):**

```
At <50 orgs:
  └─ Per-org concurrency group (current design) — fine

At 50-500 orgs:
  └─ Build queue via Supabase pgmq
      ├─ trigger-mobile-build enqueues a message: { org_slug, triggered_by }
      ├─ A single GHA workflow (scheduled, not dispatch) polls pgmq
      └─ Processes one build at a time, max 3 concurrent
      Benefits: fair scheduling, no runner starvation, built-in retry

At 500+ orgs:
  └─ Self-hosted runner pool
      ├─ 2-4 dedicated machines with Flutter + Android SDK pre-installed
      └─ Eliminates 30-min GHA cold start, reduces build time by ~40%
```

Document this in `MOBILE_FULL_PLAN.md` as a future scaling consideration, not a current action item.

---

### Production (A) Items

#### 6. Signing Verification in GHA

**Problem:** The release APK might silently sign with the debug keystore if the `signingConfigs.release` block is misconfigured (env vars not set, `storeFile` path wrong, etc.). Debug-signed APKs can't be sideloaded over release-signed ones and vice versa.

**Fix:** Add a verification step after the build, before uploading:

```yaml
- name: Verify APK signing
  run: |
    jarsigner -verify -verbose -certs build/app/outputs/flutter-apk/app-release.apk 2>&1 | head -20
    # Expected: "jar verified." + CN matching the keystore alias
    jarsigner -verify build/app/outputs/flutter-apk/app-release.apk || exit 1
  working-directory: Mobile
```

Also add a more thorough check with `apksigner` (from Android SDK build-tools):

```yaml
- name: Verify APK with apksigner
  run: |
    $ANDROID_HOME/build-tools/*/apksigner verify \
      --print-certs build/app/outputs/flutter-apk/app-release.apk
  working-directory: Mobile
```

If either step fails, the workflow exits early and the build is marked as failed in `mobile_build_status`.

#### 7. CI Health Check (Fast-Fail)

**Problem:** A broken Dart commit (compilation error, failing test) burns 8+ minutes of GHA time before failing at the `flutter build` step. For 500 orgs, that's 4000+ minutes of wasted compute.

**Fix:** Run `flutter analyze` + `flutter test` before the real build, and abort immediately on failure:

```yaml
- name: Fast-fail check
  run: |
    flutter analyze --no-fatal-infos --no-fatal-warnings || exit 1
    flutter test || exit 1
  working-directory: Mobile

# ... the real build only runs if fast-fail passes
```

Note: Fast-fail uses the *current* codebase (not org-specific assets). The branding injection happens *after* this step, so it won't affect analysis. This validates the Flutter app itself is healthy, which is the dominant failure mode.

#### 8. Dry-Run Mode

**Problem:** No way to test the full pipeline end-to-end without burning a real conference's build slot or overwriting their live `mobile_app_url`.

**Fix:** Add a `dry_run` workflow input:

```yaml
on:
  workflow_dispatch:
    inputs:
      org_slug:
        description: "Organization slug"
        required: true
      dry_run:
        description: "If true, builds + stores APK but does NOT update the org's mobile_app_url"
        type: boolean
        default: false
```

Changes to the build pipeline when `dry_run: true`:

| Step | Normal | Dry-Run |
|------|--------|---------|
| Upload APK | `mobile-apps/$org-$runid.apk` (public) | `test-builds/$org-$runid.apk` (public) |
| `set_mobile_build_result` | Updates org's `mobile_app_url` | Not called at all |
| Status polling | Admin sees "ready" with live URL | Admin sees no change (build happened in isolation) |

```yaml
- name: Upload APK to Supabase Storage
  id: upload
  run: |
    PREFIX="${{ github.event.inputs.dry_run == 'true' && 'test-builds' || 'mobile-apps' }}"
    FILENAME="$PREFIX/app-${{ inputs.org_slug }}-${{ github.run_id }}.apk"
    curl -s -X POST "$SUPABASE_URL/storage/v1/object/$FILENAME" \
      -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
      -H "Content-Type: application/octet-stream" \
      --data-binary "@Mobile/build/app/outputs/flutter-apk/app-release.apk"
    echo "url=$SUPABASE_URL/storage/v1/object/public/$FILENAME" >> $GITHUB_OUTPUT

- name: Call set_mobile_build_result (skip if dry-run)
  if: ${{ github.event.inputs.dry_run != 'true' }}
  run: |
    # ... same as normal
```

After a dry run, the admin can download the APK from the Storage bucket's `test-builds/` folder to verify branding, signing, and functionality before triggering a real build.

#### 9. Secrets Rotation Plan

**Problem:** Secrets expire, get compromised, or need periodic rotation. The current design has two categories of secrets, each with different rotation tradeoffs.

**Document this section in the repo's `SECURITY.md` (or in the deployment docs):**

| Secret | Rotation Frequency | What Breaks on Rotation | Mitigation |
|--------|-------------------|------------------------|------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Quarterly (or on compromise) | GHA workflows fail until all 3 GHA secrets are updated. Apps using service role directly (none — mobile uses anon key + JWT) are unaffected. | Update `SUPABASE_URL` + `SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` in GHA *simultaneously* (same session). Run a test workflow to confirm. |
| `ANDROID_KEYSTORE_*` | Only on compromise | **Irreversible.** Existing installed apps cannot be updated in-place — Android rejects signature mismatch. All users must uninstall + reinstall. | Never rotate the keystore unless compromised. Generate with a 10,000-day validity. Store the original `.jks` file offline (encrypted USB, password manager) as the "break glass" backup. |
| `GH_PAT` | Every 90 days | `trigger-mobile-build` Edge Function fails to dispatch workflows. No build starts. | Set a calendar reminder. Create a new PAT before expiry, swap in GHA secrets + Supabase secrets. Verify with `curl -X POST /repos/.../dispatches`. |

**Key tradeoff to document:** Keystore rotation forces a full uninstall/reinstall cycle for every user. This is why you *don't* rotate the keystore on a schedule — only on proven compromise. The 10,000-day validity + offline backup strategy means this is effectively a one-time generation step.

#### 10. Sideload Warning UX Copy

**Problem:** The current placeholder text ("Android will show a safety warning...") is generic. Android OEMs (Samsung, Xiaomi, Oppo) each customize the sideload warning screen with different wording, button labels, and colors. The admin panel should prepare users for exactly what they'll see.

**Hardcoded text in `ApplicationsPage.jsx`:**

```jsx
<div style={{
  background: '#fff3e0',
  border: '1px solid #ffcc02',
  borderRadius: 8,
  padding: '12px 16px',
  marginTop: 16,
  fontSize: 14,
  lineHeight: 1.5,
}}>
  <strong>Sideload installation notes:</strong>
  <ol style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
    <li>
      When downloading, Android may show a <strong>"This type of file can harm your device"</strong>
      warning (Play Protect). Tap <strong>"OK"</strong> to proceed.
    </li>
    <li>
      Before opening the APK, Android will prompt <strong>"Install unknown apps"</strong> —
      grant permission for your browser or file manager.
    </li>
    <li>
      During installation, you'll see <strong>"Google Play Protect — Scan not possible"</strong>.
      Tap <strong>"Install anyway"</strong> (or <strong>"More details" → "Install anyway"</strong> on Samsung devices).
    </li>
    <li>
      On Xiaomi/HyperOS devices, you may need to enable{' '}
      <strong>"Install via USB"</strong> in Developer Options first.
    </li>
  </ol>
  <p style={{ margin: '8px 0 0 0', color: '#666' }}>
    These warnings are normal for apps distributed outside the Play Store.
    The APK is signed with your organization's keystore and verified during the build process.
  </p>
</div>
```

---

### Phase Dependencies (Updated)

```
Phase 1 (Auth) ─── no deps
Phase 2 (Build pipeline) ─── no deps
Phase 3 (Admin panel) ─── needs Phase 2
Phase 4 (Branding) ─── needs Phase 1
Phase 5 (Push) ─── needs Phase 1 + Phase 4
Phase 6 (Hardening) ─── needs Phase 2 + Phase 3 (pipeline + admin must exist to harden)
```

**Recommended order:** Phase 2 → Phase 1 → Phase 3 → Phase 4 → Phase 5 → Phase 6

### When to Start Phase 6

After **at least 2-3 real conferences** have shipped using the MVP pipeline. Real failure modes will tell you which items to prioritize — no point adding 20-min TTL if stalled builds never happen, or rollback if the APK is always correct on first try. Let the system tell you what hurts.

---

### Build Verification (Pre-Phase 6)

Before any production build pipeline runs, confirm all apps compile:

| App | Last Verified | Result |
|-----|---------------|--------|
| **Landing** | 2026-07-09 | ✓ 126 modules (713ms) |
| **SuperAdmin** | 2026-07-09 | ✓ 124 modules (717ms) |
| **admin** | 2026-07-09 | ✓ 1887 modules (1.63s) |
| **webapp** | 2026-07-09 | ✓ 136 modules (1.27s) |
| **Flutter analyze** | 2026-07-09 | ✓ zero errors/warnings |
