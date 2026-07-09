# Secrets Management & Rotation

## Secrets Overview

| Secret | Used By | Source |
|--------|---------|--------|
| `SUPABASE_URL` | GHA workflows, Edge Functions | Supabase project settings |
| `SUPABASE_ANON_KEY` | GHA workflows, Edge Functions | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | GHA workflows, Edge Functions | Supabase project settings |
| `ANDROID_KEYSTORE_BASE64` | GHA build-mobile-app workflow | One-time `keytool` + `base64` generation |
| `ANDROID_KEYSTORE_PASSWORD` | GHA build-mobile-app workflow | Chosen at keystore generation |
| `ANDROID_KEY_ALIAS` | GHA build-mobile-app workflow | Chosen at keystore generation (typically "upload") |
| `ANDROID_KEY_PASSWORD` | GHA build-mobile-app workflow | Chosen at keystore generation |
| `GH_PAT` | `trigger-mobile-build` Edge Function | GitHub Personal Access Token |
| `CLERK_PUBLISHABLE_KEY` | GHA build-mobile-app workflow (.env) | Clerk Dashboard |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | `send-notification` Edge Function | Email provider |

## Rotation Schedule & Impact

### SUPABASE_* Keys — Rotate Quarterly

**What breaks:** GHA workflows fail until all 3 secrets are updated simultaneously. The mobile app uses the anon key + Clerk JWT (not service role), so existing app installs are unaffected.

**Procedure:**
1. Generate new keys in Supabase Dashboard → Project Settings → API
2. Update `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in GitHub Secrets (`Settings → Secrets and variables → Actions`)
3. Update same keys in Supabase Edge Function secrets (Dashboard → Edge Functions → `trigger-mobile-build` / `send-notification`)
4. Run a test workflow to confirm

### ANDROID_KEYSTORE_* — Never Rotate (Unless Compromised)

**Impact of rotation:** **Irreversible.** Existing installed apps cannot be updated in-place — Android rejects signature mismatch. All users must uninstall + reinstall.

**Mitigation:**
- Generate with 10,000-day validity (`-validity 10000`)
- Store the original `.jks` file offline: encrypted USB + password manager
- This is effectively a one-time generation step

**If compromised:**
1. Generate a new keystore
2. Update all `ANDROID_KEYSTORE_*` secrets in GitHub
3. Communicate to all attendees: "Please uninstall the old app and install the new version from your conference link"
4. Increment `versionCode` significantly (e.g., +1000) to ensure Android accepts the new signature

### GH_PAT — Rotate Every 90 Days

**What breaks:** `trigger-mobile-build` Edge Function cannot dispatch GitHub workflow runs. No new builds start.

**Procedure:**
1. Generate new PAT in GitHub Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
   - Scope: `actions:write` on el_Moultaqa repo only
2. Update in Supabase Dashboard → Edge Functions → `trigger-mobile-build` → `GH_PAT` env var
3. Test with a dry-run dispatch: `curl -X POST /repos/.../dispatches`

## One-Time Keystore Setup

```bash
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
base64 -w0 upload-keystore.jks | gh secret set ANDROID_KEYSTORE_BASE64
gh secret set ANDROID_KEYSTORE_PASSWORD
gh secret set ANDROID_KEY_ALIAS --body "upload"
gh secret set ANDROID_KEY_PASSWORD
rm upload-keystore.jks  # Keystore now exists only in GitHub Secrets + offline backup
```

## Emergency Contacts

If a secret is compromised or needs immediate rotation, contact the project maintainer.
