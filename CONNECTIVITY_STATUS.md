# Connectivity Status — ElMoultaqa Apps

## 1. Landing (`Landing/`)

| Connection | Status | Details |
|---|---|---|
| Supabase RPCs | ✅ Connected | `create_initial_event`, `list_discovery_events`, `list_discovery_categories`, `get_discovery_event`, `provision_org_if_needed`, `update_registration_settings`, `resolve_org_slug` |
| Supabase direct queries | ✅ Connected | `organizations` table (read-only), `plans` table (read-only) |
| Clerk Auth | ✅ Connected | Email/password, Google OAuth, org creation |
| Clerk JWT → Supabase | ✅ Connected | Via `session.getToken({ template: "supabase" })` |
| Inter-app links | ✅ Connected | Links to webapp (`VITE_WEBAPP_URL`) and admin (`VITE_ADMIN_URL`) |
| Contact form | ❌ Not connected | UI only — no POST endpoint or email service |

---

## 2. Webapp (`webapp/`)

| Connection | Status | Details |
|---|---|---|
| Supabase RPCs | ✅ Connected | `resolve_org_slug`, `org_query`, `org_insert`, `org_update`, `get_org_public_info`, `register_attendee` |
| Clerk Auth | ✅ Connected | Email/password, Google OAuth, GitHub OAuth, password reset |
| Clerk JWT → Supabase | ✅ Connected | Via `session.getToken({ template: "supabase" })` |
| HLS Live Streaming | ✅ Connected | Via `hls.js` from stream URL in DB config |
| YouTube Live | ✅ Connected | Iframe embed for YouTube URLs |
| Registration flow | ✅ Connected | Public auto-register or private code via `register_attendee` RPC |
| Questions/Feedback | ❌ Partially | `submitStreamQuestion` falls back to localStorage if RPC fails |
| Notifications page | ❌ Not wired | `NotificationsPage.jsx` exists in `pages/` but has no route in `App.jsx` |
| Speakers page | ❌ Not wired | `SpeakersPage.jsx` exists but has no route |
| Ratings page | ❌ Placeholder | `RatingsPage.jsx` is a "coming soon" placeholder |

---

## 3. Admin Panel (`admin/`)

| Connection | Status | Details |
|---|---|---|
| Supabase RPCs | ✅ Connected | All org-scoped CRUD via `org_query`, `org_insert`, `org_update`, `org_delete` + specific RPCs for discovery cards, registration settings, mobile build |
| Clerk Auth | ✅ Connected | Email/password, Google OAuth, org membership verification |
| Clerk JWT → Supabase | ✅ Connected | Via `session.getToken({ template: "supabase" })` |
| GitHub Actions (mobile build) | ✅ Connected | `ApplicationsPage` → `trigger-mobile-build` Edge Function → GitHub API `workflow_dispatch` |
| Mobile build status polling | ✅ Connected | `get_mobile_build_status` RPC |
| Data export (CSV/JSON/Excel) | ✅ Connected | Client-side generation, no backend needed |
| Program/Speaker/Sponsor local fallback | ⚠️ Partial | Falls back to localStorage when Supabase is unavailable |
| QR code generation | ❌ Not implemented | `generateQRCode()` in `backend.js` is a no-op stub |

---

## 4. Super Admin (`SuperAdmin/`)

| Connection | Status | Details |
|---|---|---|
| Supabase RPCs (platform) | ✅ Connected | All `super_admin_*` RPCs: `list_orgs`, `create_org`, `delete_org`, `block_org`, `get_stats`, CRUD plans, discovery toggles, cross-schema queries |
| Clerk Auth | ✅ Connected | Email/password, Google OAuth, `is_super_admin` role check |
| Clerk JWT → Supabase | ✅ Connected | Via `session.getToken({ template: "supabase" })` |
| Cross-org data inspection | ✅ Connected | `OrgDetailPage` uses `super_admin_org_query/insert/update/delete` with target schema name |
| Discovery card management | ✅ Connected | `listOrgsDiscoveryStatus`, `toggleDiscoveryEnable`, `toggleDiscoveryBlock` |
| Notifications | ❌ Unclear | `NotifyPage` exists but wasn't audited — needs verification |

---

## 5. Mobile App (`Mobile/`)

| Connection | Status | Details |
|---|---|---|
| Supabase RPCs | ✅ Connected | All via `supabase_service.dart`: `resolve_org_slug`, `org_query`, `org_insert`, `org_update`, `org_delete` |
| Clerk Auth | ✅ Connected | OAuth (Google, GitHub), email/password, guest mode via `clerk_flutter` |
| Clerk JWT → Supabase | ✅ Connected | `tokenProvider` callback in `main.dart` passes Clerk JWT as Supabase `accessToken` |
| Org resolution on login | ✅ Connected | `AppResolvePage` decodes JWT → calls `resolveOrg()` → routes by `org_role` |
| Admin section in-app | ✅ Connected | `/admin-notif` route with full admin UI (notifications, questions, program) |
| Notification polling | ✅ Connected | Polls every 30s |
| Push notifications | ❌ Not connected | No Firebase Messaging or any push service |
| Photo upload | ❌ Not connected | `image_picker` dependency exists but no upload endpoint — stored locally only |
| Offline fallback | ❌ Not connected | No caching layer beyond `SharedPreferences` for settings |

---

## 6. Shared Infrastructure

| Component | Status | Used By |
|---|---|---|
| Supabase project (`ekjrwizpsestbuvoyiry`) | ✅ Live | All 5 apps |
| Clerk instance | ✅ Live | All 5 apps |
| `global/supabase.js` shared module | ✅ Connected | webapp, admin, SuperAdmin, Landing (via `@global` alias) |
| GitHub Actions workflows | ✅ Configured | Mobile build trigger + admin panel build |
| Edge Function `trigger-mobile-build` | ✅ Written | Admin panel → GitHub Actions bridge |
| Supabase migration `014_mobile_app.sql` | ⚠️ Not pushed | Contains mobile build columns + RPCs |

---

## 7. Legend

- ✅ **Connected** — Fully implemented and wired
- ⚠️ **Partial** — Works with caveats or fallbacks
- ❌ **Not connected** — Missing, stubbed, or not implemented
