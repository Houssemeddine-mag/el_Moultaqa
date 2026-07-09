# DevOps & Infrastructure

> CI/CD pipelines, authentication, environment configuration, and deployment procedures.

---

## GitHub Actions Workflows

### `build-mobile-app.yml` — Mobile APK Build

**Trigger:** `workflow_dispatch` with `org_slug` input

**Steps:**
1. **Checkout** repository
2. **Fetch branding** from Supabase REST API (org name, logo URL, schema name)
3. **Fetch theme color** from tenant schema's `events.settings->>themeColor`
4. **Generate** `Mobile/lib/mobile_config.dart` with org-specific values
5. **Write** `Mobile/.env` with SUPABASE_URL, SUPABASE_ANON_KEY, CLERK_PUBLISHABLE_KEY
6. **Setup** Java 17 + Flutter 3.32.x
7. **Install** Flutter dependencies (`flutter pub get`)
8. **Build** release APK (`flutter build apk --release --no-shrink`)
9. **Rename** APK with org slug + timestamp
10. **Create GitHub Release** and upload APK
11. **Report result** back to Supabase via `set_mobile_build_result` RPC (always runs)

**Secrets required:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `CLERK_PUBLISHABLE_KEY`

### `build-admin-panel.yml` — Admin Panel Build

**Trigger:** Push/PR to `main` (paths: `admin/**`)

**Steps:**
1. `npm ci`
2. `npm run build`
3. Upload `admin/dist/` as artifact

---

## Authentication (Clerk)

All apps use Clerk for authentication. The flow:

1. User signs in via Clerk UI (OAuth or email/password)
2. Clerk issues a JWT containing: `{ sub, org_id, org_role, ... }`
3. The JWT is attached to Supabase requests via `global/supabase.js`'s `getToken` callback
4. Supabase RPCs read the JWT via `auth.jwt() ->> 'sub'`, `auth.jwt() ->> 'org_id'`
5. The `requesting_org_id()` and `requesting_user_id()` helpers extract these claims
6. SECURITY DEFINER functions validate the claims before executing

**JWT template (set in Clerk Dashboard):**
```json
{
  "sub": "{{user.id}}",
  "org_id": "{{org.id}}",
  "org_role": "{{org.role}}",
  "email": "{{user.primary_email_address}}"
}
```

---

## Environment Configuration

### Client-side variables (in `.env.local` files)
| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_STREAM_URL` | HLS live stream URL |

### Server-side secrets (set via `supabase secrets set`)
| Secret | Purpose |
|--------|---------|
| `SUPABASE_URL` | Used by Edge Functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin DB access (Edge Functions + GitHub Actions) |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Verifies Clerk webhook payloads |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME` | Email sending via `send-notification` Edge Function |
| `GH_PAT` | GitHub Personal Access Token for triggering workflow_dispatch |

---

## Deployment Procedures

### 1. Database Migrations
```bash
supabase migration up
# or run individual SQL files via Supabase SQL Editor
```

### 2. Edge Functions
```bash
supabase functions deploy clerk-webhook
supabase functions deploy send-notification
supabase functions deploy trigger-mobile-build
```

### 3. Frontend Apps (Vite → Supabase Storage or Vercel)
```bash
cd admin && npm run build   # → dist/
cd webapp && npm run build  # → dist/
cd Landing && npm run build # → dist/
cd SuperAdmin && npm run build # → dist/
```

### 4. Mobile App
Trigger via Admin Panel → "Build Mobile App" button → automated pipeline

---

## Active Supabase Project

- **URL:** `https://ekjrwizpsestbuvoyiry.supabase.co`
- **Project ref:** `ekjrwizpsestbuvoyiry`

## Active Clerk Instance

- **Domain:** `fancy-oriole-0.clerk.accounts.dev`
- **Publishable key:** `pk_test_ZmFuY3ktb3Jpb2xlLTAuY2xlcmsuYWNjb3VudHMuZGV2JA`

---

## Fixes Applied in This Session (DevOps-related)

| File | Fix |
|------|-----|
| `.github/workflows/build-mobile-app.yml:53` | Added `--fail` to events-branding `curl` command |
