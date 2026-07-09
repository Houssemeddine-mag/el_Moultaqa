# Landing Site (`Landing/`)

> Public-facing marketing and signup site. Users can browse the platform,
> sign up via Clerk, create a new conference organization, and discover
> public conferences.

---

## Tech Stack

- **Framework:** React 18 + Vite 8
- **Language:** JavaScript (JSX)
- **Auth:** Clerk (sign-in, sign-up, org creation)
- **Database:** Supabase via `global/supabase.js` + `backend.js`
- **Routing:** `react-router-dom` v6

## Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Hero section, CTA buttons, feature showcase |
| `/auth` | `AuthPage` | Clerk sign-in/sign-up |
| `/conference-builder` | `ConferenceBuilderPage` | Wizard to create a new conference org |
| `/discovery` | `DiscoveryPage` | Browse public conferences |
| `/discovery/:slug` | `ConferenceDetailPage` | Detail view for a discovered conference |
| `/about` | `AboutPage` | About the platform |
| `/documentation` | `DocumentationPage` | User-facing documentation |
| `/legal` | `LegalPage` | Terms of service, privacy policy |

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Router, Clerk auth provider, org creation flow |
| `src/backend.js` | `saveConferenceConfig()` — calls `create_initial_event` RPC |
| `src/components/OrgButton.jsx` | Organization selection button |

## Org Creation Flow

1. User signs in via Clerk on `/auth`
2. Clerk creates an organization → triggers Clerk webhook → Edge Function provisions schema
3. User fills out the conference builder wizard → creates initial event
4. User is redirected to their new admin panel

## Fixes Applied in This Session (Landing-related)

| File | Fix |
|------|-----|
| `src/backend.js:13` | Wrapped `localStorage.setItem` in try/catch |
