# Admin Panel (`admin/`)

> Organization administrator dashboard. Org admins manage their conference:
> events, program, users, streams, branding, mobile builds, and more.
> Accessible at `/c/:slug/admin/*`.

---

## Tech Stack

- **Framework:** React 18 + Vite 8
- **Language:** JavaScript (JSX)
- **Auth:** Clerk (org-based JWT)
- **Database:** Supabase via `global/supabase.js` + local fallback (`backend.js`)
- **Routing:** `react-router-dom`

## Pages (17 routes)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/c/:slug/admin/` | `AdminHomeRedirect` | Auto-redirects |
| `/c/:slug/admin/dashboard` | `DashboardPage` | Overview with stats |
| `/c/:slug/admin/events` | `EventManagerPage` | CRUD events |
| `/c/:slug/admin/program` | `ProgramPage` | Schedule / sessions |
| `/c/:slug/admin/presentations` | `PresentationsPage` | Presentation management |
| `/c/:slug/admin/users` | `UsersPage` | Attendee list + roles |
| `/c/:slug/admin/database` | `DatabaseManagerPage` | Raw table browser |
| `/c/:slug/admin/keynote-in-app` | `KeynoteInApp` | Keynote speaker config |
| `/c/:slug/admin/streams` | `StreamsPage` | Live stream management |
| `/c/:slug/admin/discovery-card` | `DiscoveryCardPage` | Conference discovery listing |
| `/c/:slug/admin/sponsors` | `SponsorsPage` | Sponsor management |
| `/c/:slug/admin/settings` | `SettingsPage` | Branding, config |
| `/c/:slug/admin/export` | `ExportAllPage` | Data export |
| `/c/:slug/admin/applications` | `ApplicationsPage` | **Mobile app build** — triggers APK pipeline |
| `/c/:slug/admin/login` | `LoginPage` | Org-scoped sign-in |
| `*` | `ErrorPage` | 404 |

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Router + `AdminLayout` — resolves org slug, sets theme, manages sidebar |
| `src/backend.js` | Full CRUD layer: `org_query/insert/update/delete` RPCs + localStorage cache |
| `src/adminConfig.js` | Nav items, branding defaults |
| `src/sharedConfig.js` | LocalStorage-based conference config persistence |
| `src/Components/Sidebar.jsx` | Navigation sidebar |
| `src/Components/Topbar.jsx` | Top bar with org info + theme color |
| `src/utils/exportUtils.js` | JSON export helpers |
| `src/utils/csvExport.js` | CSV export |

## Key Feature: Mobile App Build Pipeline

**File:** `src/pages/ApplicationsPage.jsx`

The "Build Mobile App" button triggers: `backend.triggerMobileBuild(orgSlug)` →
Supabase RPC `begin_mobile_build` → Edge Function `trigger-mobile-build` →
GitHub `workflow_dispatch` → `build-mobile-app.yml`.

The page polls `get_mobile_build_status` every 5 seconds during a build, showing
a progress indicator. On completion, it shows the download URL.

## Fixes Applied in This Session (Admin-related)

| File | Fix |
|------|-----|
| `src/pages/ApplicationsPage.jsx:190,361` | Added `.catch()` to `navigator.clipboard.writeText()` |
| `src/pages/SettingsPage.jsx:352` | Added `.catch()` to `navigator.clipboard.writeText()` |
| `src/backend.js:913,936` | Wrapped `localStorage.setItem` in try/catch |
| `src/sharedConfig.js:15` | Wrapped `localStorage.setItem` in try/catch |
