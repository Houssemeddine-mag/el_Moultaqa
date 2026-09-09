# Admin Review — el_Moultaqa

**Date:** 2026-07-13
**Reviewer:** AI-assisted comprehensive audit
**Scope:** All 5 apps (admin, webapp, Mobile, SuperAdmin, Landing) + Supabase backend

---

## Overall Rating: 6.5 / 10

| Category | Rating | Summary |
|----------|--------|---------|
| Architecture | 8/10 | Clean multi-tenant schema-per-org design. Clerk + Supabase auth integration is well done. |
| Security | 5/10 | SECURITY DEFINER bypasses RLS entirely. SQL injection surface in super admin RPCs. JWT logged to console. |
| Functionality | 7/10 | All core features work, but data model inconsistencies between apps cause silent data loss. |
| Code Quality | 6/10 | Inconsistent patterns, excessive console.log, dead code, empty catch blocks. |
| Error Handling | 4/10 | Silent error swallowing, missing mounted checks, no error boundaries wired. |
| Data Consistency | 4/10 | Same entities shaped differently across apps. Keynote data never synced. |
| Documentation | 7/10 | Good DOCUMENTATION/ directory, but code-level comments are sparse. |

---

## 1. Architecture (Rating: 8/10)

### Strengths
- **Multi-tenant by schema isolation**: Each Clerk org gets a dedicated Postgres schema (`org_<id>`) — strong tenant isolation.
- **Clerk + Supabase JWT bridge**: Clerk JWT with `org_id` claim passed as Bearer token to Supabase. This is the recommended pattern.
- **Shared `@global/supabase` module**: All 5 React apps share `queryOrgTable()`, `resolveOrgSlug()`, `createClerkSupabaseClient()` — avoids duplication.
- **Super Admin separate app**: Isolated from tenant apps, with separate auth gate.

### Weaknesses
- **Monorepo without shared build**: Each app has its own `vite.config.js`, `package.json`, and React version. `webapp/` is on React 19 while others are on React 18.3.1. This will cause issues if shared components are extracted.
- **react-router-dom version mismatch**: `admin/`, `SuperAdmin/`, `Landing/` use v6.14.2; `webapp/` uses v7.14.2. Different APIs (v7 changes how routes work).
- **`Mobile/lib/admin notif/` directory has a space** — can cause build tools and scripts to fail silently.
- **No monorepo tooling**: No Turborepo, Nx, or Lerna. Each app built independently.

---

## 2. Security Review (Rating: 5/10)

### 🔴 CRITICAL

#### 2.1 All CRUD bypasses RLS via SECURITY DEFINER
**Finding:** `org_query`, `org_insert`, `org_update`, `org_delete` are all `SECURITY DEFINER`, meaning they run with superuser privileges and **completely bypass all RLS policies** on per-org schema tables.

**Impact:** The RLS policies on `org_*.users`, `org_*.events`, `org_*.sessions`, etc. are **dead code** — never invoked. Security relies solely on the authorization logic inside these 4 functions. There is **no defense in depth**.

**Location:** `supabase/migrations/004_org_crud_functions.sql`, `007_org_query_with_options.sql`, etc.

#### 2.2 SQL injection in `super_admin_org_insert` and `super_admin_org_update`
**Finding:** Number-typed JSONB values are concatenated directly into SQL without sanitization. `'true'`/`'false'` branches in the type switch are unreachable (wrong `jsonb_typeof` return values).

**Location:** `010_super_admin.sql` lines 503-544, 547-589

#### 2.3 `super_admin_org_query` interpolates `p_limit`/`p_offset` via `%s`
**Finding:** Unlike the regular `org_query` which passes params as `$1`/`$2`, the super admin variant interpolates limit/offset directly. `p_order_dir` is not validated against a whitelist.

**Location:** `010_super_admin.sql` line 454

#### 2.4 JWT Payload Logged to Browser Console
**Finding:** Full decoded JWT payload (containing user identity, role claims) logged in production code.

**File:** `Landing/src/App.jsx:396`
```js
console.log("[DEBUG JWT] Decoded Supabase JWT payload:", JSON.stringify(payload, null, 2));
```

### 🟠 HIGH

#### 2.5 Deprecated `auth.role()` Used
**Finding:** `003_rls_policies.sql:61` uses `auth.role() = 'authenticated'` which is deprecated in Supabase. Breaks silently when anonymous sign-ins are enabled.

#### 2.6 No RLS on `public.super_admins`
**Finding:** The `super_admins` table has no RLS policy. Anyone with the anon key can query it (if direct table access is enabled).

#### 2.7 No RLS on `public.discovery_events`, `public.mobile_build_logs`
**Finding:** These tables in the public schema have no RLS. Currently protected only by being accessed exclusively via SECURITY DEFINER functions.

#### 2.8 `get_org_public_info` is unnecessarily SECURITY DEFINER
**Finding:** This simple read-only query returns public org info and could be `SECURITY INVOKER` (using the table's existing RLS).

#### 2.9 TOCTOU Race Condition in `updateEventSettings`
**Finding:** `admin/src/backend.js` fetches all events, finds the right one by ID, modifies settings, then saves via `org_update`. Another admin's change between fetch and update will be lost.

### 🟡 MEDIUM

#### 2.10 Mobile `sendNotification` uses wrong column name
**File:** `Mobile/lib/services/supabase_service.dart:282`
```dart
await insertOrgTable("notifications", {
  "title": title,
  "content": content,  // Should be "message"
});
```
Notifications table column is `message`, not `content`. All mobile notifications have empty/null bodies.

#### 2.11 No rate limiting on any RPC
No limits on `register_attendee`, `submitFeedback`, `org_query`, etc.

#### 2.12 Env files committed to repo
`.env.local` files for all 4 React apps and `Mobile/.env` are in version control. While they only contain anon keys (safe by design), it violates best practices.

### 🟢 LOW

#### 2.13 Module-level singletons in backend.js
`activeSupabase` and `activeSchemaName` are module-level mutable state. Fine for SPA but would break in SSR.

---

## 3. Functionality Review per App

### 3.1 Admin App (Rating: 7/10)

**Routes:** 17 pages covering all CRUD operations.

| Page | Status | Issues |
|------|--------|--------|
| Dashboard | ✅ Functional | Uses 6 backend calls; skeleton loading present |
| Program Management | ✅ Functional | Largest file (4500 lines); uses `alert()` for error feedback |
| Events | ✅ Functional | CRUD complete |
| Keynote Speakers | ✅ Functional | 18× console.log in one component |
| Sponsors | ✅ Functional | Base64 logo upload works |
| Streams | ✅ Functional | CRUD complete |
| Notifications | ✅ Functional | **Not in sidebar nav** — users must type URL manually |
| Questions | ✅ Functional | Answer/delete works |
| Users | ✅ Functional | Role badges + donut charts |
| Discovery Card | ✅ Functional | Editor + publish/block |
| Settings | ✅ Functional | **Never loads org info** — `loadEvent` doesn't call `getOrgInfo()` |
| DB Manager | ⚠️ Dangerous | 14 DB calls; `clearCollection` uses `Promise.all` (fails partially) |
| Export (CSV/JSON/Excel) | ✅ Functional | Multi-format |
| Applications (APK Build) | ✅ Functional | QR code is a stub |
| Presentations | ❌ Stub | Hardcoded placeholder data |

### 3.2 Webapp (Rating: 6/10)

| Page | Status | Issues |
|------|--------|--------|
| Home | ✅ Functional | Keynote carousel + sponsors |
| Program | ⚠️ Partial | Loads programs but **keynote data never matches admin** (different model) |
| Live (Streaming + Q&A) | ✅ Functional | YouTube embed, question submission |
| Profile | ✅ Functional | Profile form with photo upload |
| Auth | ✅ Functional | Clerk sign-in/sign-up + registration code |
| Notifications | ❌ DEAD | Deleted in Phase 5 (was never routed) |
| Direct Chat | ❌ DEAD | Deleted in Phase 5 (was never routed) |
| Ratings | ❌ DEAD | Deleted in Phase 5 (was never routed) |
| Speakers | ❌ DEAD | Deleted in Phase 5 (was never routed) |

### 3.3 Mobile App (Rating: 5/10)

| Page | Status | Issues |
|------|--------|--------|
| Home | ⚠️ Partial | First frame shows placeholder data before async load completes |
| Program | ⚠️ Partial | Reads from Supabase now but data model doesn't match admin |
| Live/Stream Player | ✅ Functional | YouTube + Q&A |
| Profile | ✅ Functional | Now reads/writes Supabase via `getMyProfile()`/`updateMyProfile()` |
| Settings | ⚠️ Partial | Notification toggle is local-only (no Supabase table) |
| Auth | ✅ Functional | Clerk SSO |
| Notifications | ✅ Functional | Reads from Supabase via `AdminStorage` |
| Keynote Speakers | ❌ BROKEN | Uses static sample data (`keynote_speakers.dart:8-27`), never fetches from `speakers` table |
| Presentation Feedback | ⚠️ Partial | `submitFeedback()` writes to Supabase but no read-back |
| Sidebar | ✅ Functional | Now reads config from Supabase |

### 3.4 SuperAdmin (Rating: 8/10)
**Cleanest app.** Fully Supabase-backed. Proper Clerk gate + `is_super_admin` RPC check before render.

### 3.5 Landing (Rating: 7/10)

| Page | Status | Issues |
|------|--------|--------|
| Home | ✅ Functional | Testimonials were hardcoded — not fixed (low priority) |
| Auth | ✅ Functional | Clerk SSO + registration |
| Conference Builder | ✅ Functional | Provisions org + creates event |
| Discovery | ✅ Functional | Event listing |
| Documentation | ⚠️ Partial | Pricing section duplicates `listPlans()` output statically |
| About | ✅ Functional | Contact form is `preventDefault()` only — no backend call |
| Legal | ✅ Functional | Static content |

---

## 4. Data Consistency (Rating: 4/10)

### Keynote Data — ❌ BROKEN
- **Admin stores** keynote in `sessions.metadata.keynote` as inline JSON `{name, affiliation, bio, image}`
- **Webapp reads** keynote via `speaker_id` FK → `speakers` table as `{name, title, company, photo, bio}`
- **Result:** Keynotes entered in admin never appear in webapp, and vice versa

### Conferences / Sub-sessions — ❌ ALWAYS EMPTY IN WEBAPP
- **Admin stores** conferences in `sessions.metadata.conferences`
- **Webapp maps** `conferences: []` — always empty, ignores metadata

### Sponsors — ❌ DIFFERENT SHAPES
- **Admin stores** `{id, name, website, logoData, order}`
- **Webapp returns** `{id, name, tier}` — drops website, logo, order

### Notifications — ❌ WRONG COLUMN NAME IN MOBILE
- **Admin/webapp** use `message` column
- **Mobile** writes to `content` column (doesn't exist in schema)

### User Profile Properties — ⚠️ INCONSISTENT
- **Admin/webapp**: `university`
- **Mobile**: `institution`
- Both map to `users.institution` column but naming differs

---

## 5. Error Handling (Rating: 4/10)

### Problems

#### 5.1 Empty catch blocks in Mobile (11 occurrences)
```dart
catch (e) {}   // Silent failure, no user feedback
```
Every single async operation in mobile pages silently swallows errors. Users see broken/empty UI with no explanation.

#### 5.2 No error boundaries wired (4 files)
`ErrorBoundary.jsx` exists in admin, webapp, Landing, and SuperAdmin — **none are imported** in their respective `App.jsx`. A React crash anywhere takes down the entire app.

#### 5.3 Missing mounted checks in Mobile
`profile_page.dart:_loadUserProfile()`, `_saveUserProfile()`, `home_page.dart:_loadConferenceData()` — call `setState()` after async without checking `mounted`, risking crashes on disposed widgets.

#### 5.4 alert() used for error feedback
`ProgramPage.jsx`, `KeynoteInApp.jsx` — use browser `alert()` instead of inline error components.

#### 5.5 Dead-code error boundaries
All 4 ErrorBoundary.jsx files exist but are never imported. If a React error occurs, the app shows a white screen.

---

## 6. Console.log Audit (Rating: 4/10)

| App | console.log | console.error/warn | Critical |
|-----|------------|-------------------|----------|
| admin/src/ | 20 | 50 | `KeynoteInApp.jsx` logs `formData` with base64 images (18 logs) |
| webapp/src/ | 7 | 5 | Acceptable |
| Mobile/lib/ | 0 | 0 | ✅ Clean |
| Landing/src/ | 9 | 3 | **JWT payload logged** — security leak |
| Landing/screenshot.js | 7 | 0 | Utility script (acceptable) |
| supabase/functions/ | 6 | 0 | Server-side (acceptable) |
| **TOTAL** | **78** | **~58** | |

---

## 7. Dead Code Inventory

| File | Status | Action |
|------|--------|--------|
| `admin/src/ErrorBoundary.jsx` | 🗑️ Dead — never imported | Wire into App.jsx or delete |
| `webapp/src/ErrorBoundary.jsx` | 🗑️ Dead — never imported | Same |
| `Landing/src/ErrorBoundary.jsx` | 🗑️ Dead — never imported | Same |
| `SuperAdmin/src/ErrorBoundary.jsx` | 🗑️ Dead — never imported | Same |
| `admin/src/Components/ExportButton.jsx` | 🗑️ Dead — never imported | Delete |
| `admin/src/backend.js:generateQRCode()` | 🗑️ Stub — returns null | Implement or remove |
| `Landing/src/backend.js:getConferenceConfig()` | 🗑️ Dead — uncalled | Delete |

---

## 8. Recommendations

### Immediate (Security)
1. **Remove JWT logging** from `Landing/src/App.jsx:396`
2. **Fix SQL injection** in `super_admin_org_insert` and `super_admin_org_update` — use `jsonb_populate_record` instead of string concatenation
3. **Fix `super_admin_org_query`** — validate `p_order_dir` against whitelist, use `$1`/`$2` for limit/offset
4. **Fix mobile `sendNotification` column name** — change `content` → `message`

### High Priority
5. **Fix keynote data model mismatch** — pick one approach (inline metadata or speaker_id FK) and make consistent across admin + webapp
6. **Fix webapp `conferences: []`** — read from `metadata.conferences` instead of hardcoding empty
7. **Fix webapp `fetchSponsors`** — map to same shape as admin (`name, website, logoData, order`)
8. **Add mounted checks** to mobile pages (`profile_page.dart`, `home_page.dart`)
9. **Wire ErrorBoundary** into all 4 App.jsx files
10. **Add notifications nav item** to `admin/src/adminConfig.js`

### Medium Priority
11. **Replace `auth.role()` with `auth.jwt() ->> 'role'`** in all RLS policies
12. **Add RLS** to `public.super_admins`, `public.discovery_events`, `public.mobile_build_logs`
13. **Change `get_org_public_info` to SECURITY INVOKER**
14. **Add empty catch block logging** to mobile (at minimum `debugPrint(e)`)
15. **Remove production console.log** clutter (especially `KeynoteInApp.jsx` — 18 calls)
16. **Fix mobile `keynote_speakers.dart`** — fetch from `speakers` table instead of static data
17. **Fix admin `SettingsPage`** — call `getOrgInfo()` to populate org details

### Low Priority
18. **Consolidate React versions** — upgrade admin/SuperAdmin/Landing to React 19
19. **Consolidate react-router-dom** — align on v6 or v7 across all apps
20. **Fix `Mobile/lib/admin notif/` directory name** — remove space
21. **Add `.env.local` to `.gitignore`** — keep only `.env.example` in version control
22. **Fix `DatabaseManagerPage`** — use `Promise.allSettled` instead of `Promise.all`
23. **Fix `updateProgram`** — add same session_type validation as `addProgram`

---

## 9. Per-App Score Breakdown

| App | Architecture | Security | Functionality | Code Quality | Error Handling | Data Consist. | **Overall** |
|-----|-------------|----------|--------------|-------------|---------------|--------------|-------------|
| **admin/** | 8 | 6 | 7 | 5 | 4 | — | **6.0** |
| **webapp/** | 7 | 7 | 6 | 6 | 5 | 4 | **5.8** |
| **Mobile/** | 7 | 6 | 5 | 5 | 3 | 4 | **5.0** |
| **SuperAdmin/** | 8 | 7 | 8 | 8 | 7 | — | **7.6** |
| **Landing/** | 7 | 5 | 7 | 6 | 5 | — | **6.0** |
| **Supabase/** | 8 | 5 | — | 6 | — | — | **6.3** |
| **Average** | **7.5** | **6.0** | **6.6** | **6.0** | **4.8** | **4.0** | **6.1** |

---

## Methodology

This review covered:
- All 5 React/Flutter apps (15,000+ lines of source code)
- All 21 Supabase migration files (RLS policies, functions, triggers)
- All `.env` files and shared modules
- Supabase Edge Functions (clerk-webhook, trigger-mobile-build)
- Supabase security checklist from official docs

Issues scored based on: security impact, user-facing impact, data integrity impact, and maintainability impact.
