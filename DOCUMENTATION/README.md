# el_Moultaqa — Documentation Index

> Platform for managing and attending conferences. Multi-tenant, Clerk-authenticated,
> Supabase-backed, with a cross-platform Flutter mobile app and four React SPAs.

---

## App Documentation

| Document | Covers |
|----------|--------|
| [`SUPERADMIN.md`](./SUPERADMIN.md) | Platform admin dashboard (`/system/*`) — org management, plans, stats, notifications |
| [`ADMIN.md`](./ADMIN.md) | Org admin panel (`/c/:slug/admin/*`) — events, program, users, streams, mobile builds |
| [`MOBILE.md`](./MOBILE.md) | Flutter cross-platform app — attendee experience, auth, live stream, profile |
| [`LANDING.md`](./LANDING.md) | Public marketing site — signup, org creation, conference discovery |
| [`WEBAPP.md`](./WEBAPP.md) | Attendee web app (`/c/:slug/*`) — program, live, profile, ratings |

## Backend Documentation

| Document | Covers |
|----------|--------|
| [`SUPABASE.md`](./SUPABASE.md) | Database schema (15 migrations), SECURITY DEFINER functions, Edge Functions |
| [`DEVOPS.md`](./DEVOPS.md) | GitHub Actions, secrets, Clerk auth, Supabase config |

## Session Fixes

| Document | Covers |
|----------|--------|
| [`FIXES.md`](./FIXES.md) | All ~68 fixes applied in the production-readiness session |

---

## Quick Architecture

```
                     Frontend Apps                        Backend
                 +-- Admin (React 18)                      |
                 +-- Webapp (React 19)                     |-- Supabase
                 +-- Landing (React 18)                    |   +-- Public schema
                 +-- SuperAdmin (React 18)                 |   +-- Tenant schemas × N
                 +-- Mobile (Flutter 3.32)                 |   +-- 3 Edge Functions
                                                           |-- Clerk (auth)
                 All share @global/supabase.js              |-- GitHub Actions
```

**Core pattern:** Each Clerk org → dedicated Postgres schema (`org_2abc123`).  
All data access via SECURITY DEFINER RPCs that validate the Clerk JWT.
