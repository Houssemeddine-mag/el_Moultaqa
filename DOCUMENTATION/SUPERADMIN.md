# SuperAdmin App (`SuperAdmin/`)

> Platform-administrator dashboard for managing all organizations, pricing plans,
> and system-wide operations. Accessible at `/system/*`.

---

## Tech Stack

- **Framework:** React 18 + Vite 8
- **Language:** JavaScript (JSX)
- **Auth:** Clerk (JWT — verified via `is_super_admin` RPC)
- **Database:** Supabase via `global/supabase.js`
- **Routing:** `react-router-dom`

## Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/system/login` | `LoginPage` | Clerk sign-in |
| `/system/dashboard` | `DashboardPage` | Stats cards, plan distribution chart, org growth chart, top orgs by user count |
| `/system/organizations` | `OrganizationsPage` | Table of all orgs with plan, blocked status, user/event counts; create new org |
| `/system/organizations/:slug` | `OrgDetailPage` | Drill-down: schema tables, user/event counts, block/unblock |
| `/system/plans` | `PlansPage` | CRUD for pricing plans |
| `/system/notify` | `NotifyPage` | Send email notifications via `send-notification` Edge Function |

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Router — wraps all routes in `ProtectedLayout` that calls `is_super_admin` |
| `src/backend.js` | `useSuperAdmin()` hook wrapping all RPC calls |
| `src/adminConfig.js` | Sidebar navigation items |
| `src/Components/Sidebar.jsx` | Navigation sidebar |
| `src/Components/ProtectedRoute.jsx` | Route guard verifying super admin status |

## RPC Functions Used

All calls go through Supabase `.rpc()`:

- `public.is_super_admin()` — gate check
- `public.super_admin_list_orgs()` — org table (with plan + counts)
- `public.super_admin_create_org(p_name, p_slug, p_admin_email)` — create org
- `public.super_admin_delete_org(p_slug)` — drop org + schema
- `public.super_admin_block_org(p_slug)` / `super_admin_unblock_org(p_slug)`
- `public.super_admin_list_plans()` — all pricing plans
- `public.super_admin_upsert_plan(...)` — create/update plan
- `public.super_admin_toggle_plan(p_plan_id, p_is_active)`
- `public.super_admin_delete_plan(p_plan_id)`
- `public.super_admin_get_stats()` — aggregate counts
- `public.super_admin_get_chart_data()` — plan distribution, org growth, top orgs
- `public.super_admin_get_detailed_stats()` — revenue, engagement metrics
- `public.super_admin_org_query()` / `_org_insert()` / `_org_update()` / `_org_delete()` — direct schema access
- `public.super_admin_org_table_counts(p_schema)` — row counts per table
- `public.super_admin_list_orgs_discovery_status()` — discovery pipeline status
- `public.super_admin_toggle_discovery_enable(p_org_slug, p_enabled)`
- `public.super_admin_toggle_discovery_block(p_org_slug, p_blocked)`

## Fixes Applied in This Session (SuperAdmin-related)

No SuperAdmin-specific fixes were needed. The `010_super_admin.sql` migration was patched
for `SET search_path` on one function (`organization_users`), but all 17 other SECURITY
DEFINER functions in that file already had it.
