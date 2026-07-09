# Build Guide — Mobile App Pipeline

## Prerequisites

- GitHub repo admin access
- Supabase Dashboard access (project `ekjrwizpsestbuvoyiry`)
- Node.js + `gh` CLI authenticated
- `keytool` (comes with JDK)

---

## Step 1: Create Supabase Storage Bucket

In the Supabase Dashboard:

1. Go to **Storage** → **New bucket**
2. Name: `mobile-apps`
3. Public bucket: **ON**
4. Click **Create bucket**

Or via SQL Editor:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('mobile-apps', 'mobile-apps', true);
```

---

## Step 2: Generate Android Signing Keystore

Run these commands **on your local machine** (one-time):

```bash
# Generate keystore (10,000-day validity)
keytool -genkey -v -keystore upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload

# You'll be prompted for:
#   - Keystore password  → choose a strong one (save it!)
#   - Key password       → can be same as keystore password
#   - Distinguished name → fill in at least CN=YourName

# Encode to base64 and store in GitHub Secrets
base64 -w0 upload-keystore.jks | gh secret set ANDROID_KEYSTORE_BASE64

# Store other keystore secrets
gh secret set ANDROID_KEYSTORE_PASSWORD
# paste your keystore password

gh secret set ANDROID_KEY_ALIAS --body "upload"

gh secret set ANDROID_KEY_PASSWORD
# paste your key password (usually same as keystore password)

# Delete local keystore (it's now in GitHub Secrets + your offline backup)
rm upload-keystore.jks
```

**⚠️ Save the `.jks` file offline** (encrypted USB / password manager) as break-glass backup.

---

## Step 3: Set GitHub Secrets

| Secret | Value |
|--------|-------|
| `ANDROID_KEYSTORE_BASE64` | Set in Step 2 |
| `ANDROID_KEYSTORE_PASSWORD` | Set in Step 2 |
| `ANDROID_KEY_ALIAS` | Set in Step 2 |
| `ANDROID_KEY_PASSWORD` | Set in Step 2 |
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → service_role key |
| `CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys → Publishable Key |

```bash
gh secret set SUPABASE_URL
gh secret set SUPABASE_ANON_KEY
gh secret set SUPABASE_SERVICE_ROLE_KEY
gh secret set CLERK_PUBLISHABLE_KEY
```

---

## Step 4: Set Edge Function Secrets (Supabase Dashboard)

For `trigger-mobile-build`:

1. Go to **Supabase Dashboard** → **Edge Functions** → `trigger-mobile-build`
2. Set these secrets:

| Secret | Value |
|--------|-------|
| `GH_PAT` | GitHub Personal Access Token (fine-grained, scoped to `actions:write` on this repo) |

For `send-notification`:

1. Go to **Edge Functions** → `send-notification`
2. Set these secrets:

| Secret | Value |
|--------|-------|
| `SMTP_HOST` | Your SMTP server hostname |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_PORT` | Default: `587` |

> `SUPABASE_URL` and `SUPABASE_ANON_KEY` are injected automatically by the Supabase runtime — no need to set them manually.

---

## Step 5: Verify GH_PAT Scope

The `GH_PAT` used by `trigger-mobile-build` must be a fine-grained PAT scoped to:

- **Repository:** `Houssemeddine-mag/el_Moultaqa`
- **Permissions:** `Actions: Write`

Check in **GitHub Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens**.

---

## Step 6: Trigger Your First Build

### Option A: Via Admin Panel
1. Go to your admin panel → **Applications** sidebar entry
2. Click **▶ Build Mobile App**
3. Wait... status updates automatically

### Option B: Via GitHub Actions (Manual)
1. Go to **GitHub → Actions → Build Mobile App → Run workflow**
2. Enter `org_slug` (e.g., `my-conference`)
3. Optional: set `dry_run` to `true` to test without updating the live URL
4. Click **Run workflow**

---

## Step 7: Verify the Result

After a successful build:

1. The admin panel shows **"Ready"** with a Download link + QR code
2. APK is available at:
   - **Supabase Storage:** `https://[project].supabase.co/storage/v1/object/public/mobile-apps/{org_slug}/app-{build_number}.apk`
   - **GitHub Release:** `https://github.com/Houssemeddine-mag/el_Moultaqa/releases/tag/mobile/{org_slug}-{run_number}`
3. Scan the QR code on an Android device to download and install

---

## Dry Run Mode

For testing the full pipeline without affecting a live conference:

```bash
# Trigger via GitHub UI with dry_run = true
# The APK is built and uploaded to:
#   supabase.co/storage/v1/object/public/test-builds/{org_slug}-{timestamp}.apk
# The org's mobile_app_url is NOT updated
```

---

## Architecture

```
Admin Panel (Web) → trigger-mobile-build Edge Function
  → GitHub Actions (build-mobile-app.yml)
    ├── Fetch org branding from Supabase DB (name, logo, theme, build_number)
    ├── Generate mobile_config.dart + custom icons
    ├── flutter analyze + flutter test (fast-fail)
    ├── flutter build apk --release --build-number=N
    ├── jarsigner -verify (signing check)
    ├── Upload APK to Supabase Storage (mobile-apps/{org}/app-{N}.apk) ← canonical URL
    ├── Upload APK to GitHub Release (backup / audit trail)
    └── set_mobile_build_result() → org.mobile_app_url updated
```

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Build fails at keystore decode | `ANDROID_KEYSTORE_BASE64` not set or invalid | Re-run Step 2 |
| `flutter analyze` fails | Dart code issue | Fix errors locally first |
| `flutter test` fails | Test failure | Run `flutter test` locally |
| Upload to Storage fails | `mobile-apps` bucket doesn't exist | Run Step 1 |
| QR code shows 404 | Storage bucket not public | Set bucket to public |
| `trigger-mobile-build` returns 502 | `GH_PAT` expired or wrong scope | Rotate PAT (Step 5) |
| Admin panel shows "Building…" forever | GHA runner crashed | Wait 15 min for TTL to expire, then retry |
