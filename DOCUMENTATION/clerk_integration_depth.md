# Clerk Integration Depth Report

> Generated: 2026-07-10
> Total files with Clerk references: **70+ unique files** across 9 application areas

---

## 1. Dependency Map

| Package | Version | Used By |
|---|---|---|
| `@clerk/clerk-react` | `^5.61.8` | Landing, webapp, admin, SuperAdmin |
| `clerk_flutter` | `^0.0.16-beta` | Mobile |
| `clerk_auth` | (transitive) | Mobile (via clerk_flutter) |
| `@clerk/shared` | `^3.47.7` | Transitive (via @clerk/clerk-react) |

**Clerk Dashboard**: `fancy-oriole-0.clerk.accounts.dev`

---

## 2. Files by App

### 2.1 Mobile (Flutter) — 7 files

| File | Clerk Usage |
|---|---|
| `Mobile/pubspec.yaml` | Dependency: `clerk_flutter: ^0.0.16-beta` |
| `Mobile/lib/main.dart` | `ClerkAuth` wrapper, `ClerkAuthBuilder`, `ClerkAuthConfig`, `_confirmDisconnect(ClerkAuthState)`, reads `CLERK_PUBLISHABLE_KEY` from `--dart-define` + dotenv |
| `Mobile/lib/pages/auth_page.dart` | `ClerkAuthBuilder`, `ClerkAuthState`, `ClerkAuthentication`, `sessionToken(templateName: 'supabase')`, `tokenProvider` |
| `Mobile/lib/services/supabase_service.dart` | `tokenProvider` callback — feeds Clerk JWT to Supabase `accessToken` |
| `Mobile/lib/widgets/sidebar.dart` | `onDisconnectRequested` callback (generic, but wired to Clerk sign-out in main.dart) |
| `Mobile/test/widget_test.dart` | `ClerkAuth` wrapper, `CLERK_PUBLISHABLE_KEY` from `--dart-define` |
| `Mobile/.env` | `CLERK_PUBLISHABLE_KEY` |

### 2.2 Landing (React) — 9 files

| File | Clerk Usage |
|---|---|
| `Landing/package.json` | Dependency: `@clerk/clerk-react: ^5.61.8` |
| `Landing/vite.config.js` | Vite resolve alias for `@clerk/clerk-react` |
| `Landing/.env.local` | `VITE_CLERK_PUBLISHABLE_KEY` |
| `Landing/src/main.jsx` | `ClerkProvider` wrapper |
| `Landing/src/App.jsx` | `useUser`, `useClerk`, `useSignIn`, `useSignUp`, `useOrganizationList`, `createOrganization`, `session.getToken({ template: 'supabase' })`, `AuthenticateWithRedirectCallback`, `clerk.signOut()`, `setActive`, maps Clerk user fields, passes `p_clerk_org_id`, `p_owner_clerk_id` |
| `Landing/src/backend.js` | `p_clerk_org_id` in RPC params |
| `Landing/src/components/OrgButton.jsx` | `useClerkSupabase`, queries `clerk_org_id` column |
| `Landing/src/pages/ConferenceBuilderPage.jsx` | `useClerkSupabase` |
| `Landing/src/pages/ConferenceDetailPage.jsx` | `useClerkSupabase` |
| `Landing/src/pages/DiscoveryPage.jsx` | `useClerkSupabase` |

### 2.3 Webapp (React) — 10 files

| File | Clerk Usage |
|---|---|
| `webapp/package.json` | Dependency: `@clerk/clerk-react: ^5.61.8` |
| `webapp/vite.config.js` | Vite resolve alias for `@clerk/clerk-react` |
| `webapp/.env.local` | `VITE_CLERK_PUBLISHABLE_KEY` |
| `webapp/src/main.jsx` | `ClerkProvider` wrapper |
| `webapp/src/App.jsx` | `useAuth`, `useClerk`, `AuthenticateWithRedirectCallback`, `useClerkSupabase` |
| `webapp/src/context/AuthContext.jsx` | `useUser()` → maps `clerkUser` fields (id, email, name, imageUrl, createdAt, lastSignInAt) to app's user shape |
| `webapp/src/context/ConferenceContext.jsx` | `useClerkSupabase`, `resolveOrgSlug` |
| `webapp/src/pages/AuthPage.jsx` | `useSignIn`, `useSignUp`, `useClerk`, `useClerkSupabase` |
| `webapp/src/pages/ProfilePage.jsx` | `useClerk`, `signOut()` |
| `webapp/src/services/localService.js` | `clerkUserId` parameter in `registerAttendee`, `checkUserMembership`, profile queries; `clerk_user_id` in filters and inserts |

### 2.4 Admin (React) — 8 files

| File | Clerk Usage |
|---|---|
| `admin/package.json` | Dependency: `@clerk/clerk-react: ^5.61.8` |
| `admin/vite.config.js` | Vite resolve alias for `@clerk/clerk-react` |
| `admin/.env.local` | `VITE_CLERK_PUBLISHABLE_KEY` |
| `admin/src/main.jsx` | `ClerkProvider` wrapper |
| `admin/src/App.jsx` | `useAuth`, `useClerk`, `useOrganizationList`, `setActive({ organization: clerk_org_id })`, `AuthenticateWithRedirectCallback`, `clerk_org_id` org switching logic |
| `admin/src/backend.js` | Queries `clerk_org_id`, `owner_clerk_id`, maps to `clerkOrgId`, `ownerClerkId`, `clerkUserId` |
| `admin/src/pages/LoginPage.jsx` | `useSignIn`, `useClerkSupabase`, passes `clerk_org_id` on org switch |
| `admin/src/Components/Topbar.jsx` | `useClerk`, `useUser`, `signOut()`, maps `clerkUser` fields |
| `admin/src/Components/Sidebar.jsx` | `useClerk`, `signOut()` |

### 2.5 SuperAdmin (React) — 5 files

| File | Clerk Usage |
|---|---|
| `SuperAdmin/package.json` | Dependency: `@clerk/clerk-react: ^5.61.8` |
| `SuperAdmin/vite.config.js` | Vite resolve alias for `@clerk/clerk-react` |
| `SuperAdmin/.env.local` | `VITE_CLERK_PUBLISHABLE_KEY` |
| `SuperAdmin/src/main.jsx` | `ClerkProvider` wrapper |
| `SuperAdmin/src/App.jsx` | `useAuth`, `useClerk`, `AuthenticateWithRedirectCallback` |
| `SuperAdmin/src/backend.js` | `useClerkSupabase` |
| `SuperAdmin/src/pages/NotifyPage.jsx` | Queries `owner_clerk_id`, `clerk_user_id` |
| `SuperAdmin/src/pages/OrgDetailPage.jsx` | Skips `clerk_user_id` column in display |

### 2.6 Global Shared Module — 1 file

| File | Clerk Usage |
|---|---|
| `global/supabase.js` | `createClerkSupabaseClient(getToken)` — wraps Supabase client with Clerk session token. `useClerkSupabase()` hook — uses `useSession()` from Clerk to get JWT. Sends Clerk `session.getToken({ template: 'supabase' })` as Supabase `accessToken`. **Every web app's Supabase client goes through this.** |

### 2.7 Supabase Edge Functions — 2 files

| File | Clerk Usage |
|---|---|
| `supabase/functions/clerk-webhook/index.ts` | **Webhook handler.** Validates `CLERK_WEBHOOK_SIGNING_SECRET`, handles `organization.created` (provisions tenant schema, inserts into `public.organizations` with `clerk_org_id` and `owner_clerk_id`, creates admin user with `p_clerk_user_id`) and `organization.deleted` (drops schema, deletes org row). Uses `toSchemaName(clerkOrgId)` to convert Clerk IDs to Postgres schema names. |
| `supabase/functions/trigger-mobile-build/index.ts` | References Clerk JWT auth flow in comment |

### 2.8 Database Migrations — 15+ migration files

Clerk columns across the database:

| Column | Table | Schema |
|---|---|---|
| `clerk_org_id` | `organizations` | `public` |
| `owner_clerk_id` | `organizations` | `public` |
| `clerk_user_id` | `users` | Tenant schemas |
| `clerk_user_id` | `questions` | Tenant schemas (indexed) |
| `clerk_user_id` | `feedback` | Tenant schemas (indexed) |
| `clerk_user_id` | `check_ins` | Tenant schemas (indexed) |

RPC parameters: `p_clerk_org_id`, `p_owner_clerk_id`, `p_clerk_user_id` in `provision_org`, `provision_org_if_needed`, `insert_org_user`, etc.

RLS uses `clerk_org_id = public.requesting_org_id()` — extracts `org_id` claim from the **Clerk JWT**.

### 2.9 GitHub Actions — 1 file

| File | Clerk Usage |
|---|---|
| `.github/workflows/build-mobile-app.yml` | Reads `CLERK_PUBLISHABLE_KEY` from secrets, writes to `.env` for mobile build, passes as `--dart-define` for tests |

### 2.10 Documentation — 12 files

Files with Clerk references: `DOCUMENTATION/README.md`, `DOCUMENTATION/DEVOPS.md`, `DOCUMENTATION/SUPABASE.md`, `DOCUMENTATION/WEBAPP.md`, `DOCUMENTATION/ADMIN.md`, `DOCUMENTATION/SUPERADMIN.md`, `DOCUMENTATION/MOBILE.md`, `DOCUMENTATION/LANDING.md`, `ADMIN_BACKEND_IMPLEMENTATION.md`, `ADMIN_BACKEND_API_REFERENCE.md`, `ADMIN_IMPLEMENTATION_SUMMARY.md`, `MOBILE_FULL_PLAN.md`, `BUILD_GUIDE.md`, `PRODUCTION_CRITICAL.md`, `SECURITY.md`, `doing now.md`, `CONNECTIVITY_STATUS.md`, `setup_guide.md`

---

## 3. Clerk Usage Patterns Summary

### 3.1 Auth Providers
- **React apps**: `<ClerkProvider>` wraps the component tree in `main.jsx`
- **Flutter app**: `ClerkAuth` widget wraps the app, `ClerkAuthConfig` with `publishableKey`

### 3.2 Auth Hooks/Widgets
- **React**: `useUser()`, `useAuth()`, `useClerk()`, `useSignIn()`, `useSignUp()`, `useSession()`, `useOrganizationList()`
- **Flutter**: `ClerkAuthBuilder`, `ClerkAuthentication`, `ClerkAuthState`

### 3.3 JWT Integration with Supabase
Every app uses Clerk's JWT as the Supabase `accessToken`:
- **React**: `session.getToken({ template: 'supabase' })` → passed to `createClerkSupabaseClient(getTokenFn)` → set as `accessToken` in `supabase-js`
- **Flutter**: `authState.sessionToken(templateName: 'supabase')` → set as `tokenProvider` → passed as `accessToken` in `supabase_flutter`

### 3.4 Org Provisioning Flow
```
User creates org in Clerk (Landing)
  → Clerk webhook triggers Edge Function
  → Edge Function creates Postgres schema named "org_{clerkOrgId}"
  → Inserts into public.organizations with clerk_org_id
  → Creates admin user record with clerk_user_id
```

### 3.5 Auth Flow
```
App starts → ClerkProvider/ClerkAuth initializes
  → User signs in (email/password or OAuth via Clerk UI)
  → Clerk issues JWT with claims: { sub, org_id, org_role }
  → JWT is passed to Supabase as accessToken
  → Supabase RPCs verify JWT claims (requesting_org_id())
  → Data access granted
```

---

## 4. What Would Need to Change for Migration

| Component | Migration Effort |
|---|---|
| **global/supabase.js** | Rewrite — remove Clerk token logic, use standard `createClient()` |
| **clerk-webhook Edge Function** | Rewrite or replace — this is how orgs get created. Need alternative trigger |
| **12 DB migration files** | Add `org_id` and `user_id` columns (replacing `clerk_org_id`, `clerk_user_id`) |
| **RLS policies** | Change `clerk_org_id = requesting_org_id()` to use Supabase `auth.uid()` or a new claim |
| **Landing (sign-up + org creation)** | Heavy rewrite — Clerk handles org creation UI + API |
| **webapp (Attendee app)** | Medium — replace `useClerkSupabase` with standard Supabase client, `AuthContext` with `useSession` from Supabase |
| **admin (Admin panel)** | Medium — replace org switching (`setActive`) with custom logic |
| **SuperAdmin** | Light — replace `useClerkSupabase` with standard client + Supabase auth |
| **Mobile (Flutter)** | Medium — see `MOBILE_FULL_PLAN.md` for detailed scope (8 files modify, 2 create) |
| **Database** | Add `supabase_org_id` / `supabase_user_id` columns, migrate existing Clerk IDs, update all RPCs and policies |
| **Documentation** | Update all `.md` files referencing Clerk |

### Estimated total: 50+ files across the full stack
