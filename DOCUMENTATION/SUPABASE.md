# Supabase Backend (`supabase/`)

> The entire backend runs on Supabase (Postgres + Edge Functions). There is no
> separate API server. All client-server communication goes through Supabase
> RPCs (`supabase.rpc(...)`) or the REST API.

---

## Database Migrations (15 files)

Migrations are sequential. Each file creates tables, functions, and policies.

### 001 — Public Schema
**`001_public_schema.sql`**
- `public.organizations` — master tenant registry (id, clerk_org_id, name, slug, schema_name, owner_clerk_id, logo_url, domain, created_at, updated_at)
- `public.plans` — subscription tiers (free, pro, enterprise)
- `public.subscriptions` — links orgs to plans
- `public.set_updated_at()` trigger function

### 002 — Org Schema Template
**`002_org_schema_template.sql`**
- `create_org_schema(p_schema_name)` — creates isolated schema per org with tables: users, events, speakers, sessions, tickets
- `drop_org_schema(p_schema_name)` — drops an org schema

### 003 — RLS Policies
**`003_rls_policies.sql`**
- `requesting_org_id()` — extracts org_id from Clerk JWT
- `requesting_user_id()` — extracts sub (user ID) from Clerk JWT
- RLS policies on organizations, plans, subscriptions
- `setup_org_schema_rls(p_schema_name)` — applies per-org RLS
- `provision_org_schema(p_schema_name)` — create schema + apply RLS

### 004 — Internal Helpers
**`004_internal_helpers.sql`**
- `_internal_insert_org_user(p_schema_name, p_clerk_user_id, ...)` — inserts user into tenant schema
- `resolve_org_slug(p_slug)` — resolves slug to org details (name, schema, logo, blocked flag)
- `org_query(p_schema_name, p_table_name, ...)` — generic dynamic query function

### 005 — Tenant Mutations
**`005_tenant_mutations.sql`**
- `org_insert`, `org_update`, `org_delete` — secure CRUD on tenant schemas with table whitelist
- `create_initial_event(...)` — creates first event in org schema

### 006 — Client Provisioning
**`006_client_provisioning.sql`**
- `provision_org_if_needed(...)` — client-side fallback if Clerk webhook is delayed

### 007 — Attendee Security Access
**`007_attendee_security_access.sql`**
- Replaces `org_query/insert/update/delete` with versions supporting public attendee access

### 008 — Gated Registration
**`008_gated_registration.sql`**
- `get_org_public_info(p_slug)` — public org info (no membership required)
- `register_attendee(...)` — the ONLY way for non-members to join an org
- `update_registration_settings(...)` — admin-only: set public/private mode
- Replaces org CRUD with membership-gated versions

### 009 — Notifications & Questions
**`009_notifications_questions.sql`**
- Adds `notifications` and `questions` tables to all existing and future org schemas
- Patches `create_org_schema`, `org_query`, `org_insert`, `org_delete`

### 010 — Super Admin
**`010_super_admin.sql`** (742 lines, 18 SECURITY DEFINER functions)
- `super_admins` table + seed
- `is_super_admin()` — gate check
- `super_admin_list_orgs()` — org listing with plan + counts
- `super_admin_create_org(...)` — creates org without payment
- `super_admin_list_plans()` / `_upsert_plan()` / `_toggle_plan()` / `_delete_plan()`
- `super_admin_get_stats()` / `_get_chart_data()` — dashboard data
- `organization_users(p_schema)` — user count helper
- `super_admin_org_query/insert/update/delete` — direct schema access
- `super_admin_org_table_counts(p_schema)` — row counts
- `super_admin_delete_org(p_slug)` — drops schema + records
- `super_admin_block_org(p_slug)` / `super_admin_unblock_org(p_slug)`

### 011 — Blocked Orgs Visible
**`011_blocked_org_visible.sql`**
- Replaces `resolve_org_slug()` — now returns `blocked` boolean instead of hiding blocked orgs from non-super-admins
- Also returns `theme_color` for frontend theming

### 012 — Discovery System
**`012_discovery.sql`**
- `public.discovery_events` table
- Public RPCs: `list_discovery_events()`, `list_discovery_categories()`, `get_discovery_event(p_slug)`
- Org admin RPCs: `org_get_discovery_card()`, `org_save_discovery_card()`, `org_publish_/unpublish_discovery_card()`
- Super admin RPCs: `super_admin_list_orgs_discovery_status()`, `toggle_discovery_enable()`, `toggle_discovery_block()`
- Updates `super_admin_list_orgs()` to include discovery status

### 013 — Detailed Stats
**`013_detailed_stats.sql`**
- `super_admin_get_detailed_stats()` — revenue, MRR, growth, engagement metrics

### 014 — Mobile App Build
**`014_mobile_app.sql`**
- Adds mobile columns to `public.organizations`: `mobile_app_url`, `mobile_built_at`, `mobile_config_hash`, `mobile_build_status`, `mobile_build_error`, `mobile_build_requested_at`
- `begin_mobile_build(p_org_slug)` — TOCTOU-safe build slot claim
- `set_mobile_build_result(...)` — called by GitHub Actions to report build status
- `get_mobile_build_status(p_org_slug)` — returns build state (gated by Clerk JWT)
- Also updates `resolve_org_slug()` to include `mobile_app_url` in its return

### 015 — Feedback Table
**`015_feedback_table.sql`**
- Adds `feedback` table to all org schemas for presentation ratings
- Patches `create_org_schema`, `org_query`, `org_insert`

---

## Edge Functions (Deno/TypeScript)

### `clerk-webhook` (`functions/clerk-webhook/index.ts`)
- Handles Clerk webhooks: `organization.created`, `organization.deleted`, `organization.updated`
- On created: provisions Postgres schema, creates org record + free subscription + inserts admin user
- On deleted: drops schema + removes org record

### `send-notification` (`functions/send-notification/index.ts`)
- SMTP email sender via nodemailer (Gmail/any SMTP)
- Accepts: `{ to, subject, body, org_slug? }`
- Used by SuperAdmin NotifyPage

### `trigger-mobile-build` (`functions/trigger-mobile-build/index.ts`)
- Receives Clerk JWT, validates admin/org via `begin_mobile_build` RPC
- Dispatches GitHub Actions `workflow_dispatch` to `build-mobile-app.yml`
- Requires `GH_PAT` secret

---

## Fixes Applied in This Session (Supabase-related)

| File | Fix |
|------|------|
| `migrations/002_org_schema_template.sql` | Added `SET search_path = public` to `create_org_schema`, `drop_org_schema` |
| `migrations/003_rls_policies.sql` | Added `SET search_path = public` to `setup_org_schema_rls`, `provision_org_schema` |
| `migrations/004_internal_helpers.sql` | Added `SET search_path = public` to `_internal_insert_org_user`, `org_query` |
| `migrations/005_tenant_mutations.sql` | Added `SET search_path = public` to all 4 functions: `org_insert`, `org_update`, `org_delete`, `create_initial_event` |
| `migrations/006_client_provisioning.sql` | Added `SET search_path = public` to `provision_org_if_needed` |
| `migrations/007_attendee_security_access.sql` | Added `SET search_path = public` to all 4 functions |
| `migrations/008_gated_registration.sql` | Added `SET search_path = public` to all 7 functions |
| `migrations/009_notifications_questions.sql` | Added `SET search_path = public` to all 4 functions |
| `migrations/010_super_admin.sql` | Added `SET search_path = public` to `organization_users` |
| `migrations/011_blocked_org_visible.sql` | Added `ALTER TABLE ADD COLUMN theme_color TEXT`, removed `mobile_app_url` (added in 014) |
| `migrations/014_mobile_app.sql` | Added `resolve_org_slug` update to include `mobile_app_url` (now that the column exists) |
| `migrations/015_feedback_table.sql` | Added `SET search_path = public` to all 3 functions |
