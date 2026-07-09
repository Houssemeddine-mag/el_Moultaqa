# Attendee Web App (`webapp/`)

> The attendee-facing conference web application. Attendees view the program,
> watch live streams, browse speakers, submit feedback, manage their profile,
> and receive notifications. Accessible at `/c/:slug/*`.

---

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Language:** JavaScript (JSX)
- **Auth:** Clerk (JWT via `global/supabase.js`)
- **Database:** Supabase via `global/supabase.js` + `localService.js`
- **Streaming:** HLS.js for live video playback
- **Routing:** `react-router-dom` v7

## Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/c/:slug/` | `HomePage` | Conference overview, countdown, stats |
| `/c/:slug/program` | `ProgramPage` | Full schedule by day |
| `/c/:slug/live` | `LivePage` | HLS live stream |
| `/c/:slug/profile` | `ProfilePage` | User profile |
| `/c/:slug/auth` | `AuthPage` | Clerk sign-in |
| `/c/:slug/speakers` | `SpeakersPage` | Speaker list |
| `/c/:slug/notifications` | `NotificationsPage` | Notification feed |
| `/c/:slug/ratings` | `RatingsPage` | Session ratings |
| `/c/:slug/direct` | `DirectPage` | DMs / chat |

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Router + `ProtectedRoute` — resolves org slug, checks membership, blocks suspended orgs |
| `src/context/ConferenceContext.jsx` | Fetches live conference config from DB via `resolveOrgSlug` + `fetchConferenceConfig`, applies theme color |
| `src/context/AuthContext.jsx` | Clerk user adapter |
| `src/services/localService.js` | DB service + localStorage fallback for all entities |
| `src/conferenceConfig.js` | Default branding/schedule config |
| `src/components/SessionCard.jsx` | Program session card |
| `src/components/SpeakerCard.jsx` | Speaker card |
| `src/components/KeynoteCard.jsx` | Keynote card |

## Configuration Loading

The `ConferenceContext` loads config in two phases:

1. **Unauthenticated:** Calls `resolve_org_slug` to get org name, logo, theme_color from
   the `public.organizations` table. Sets a basic config.
2. **Authenticated:** Calls `fetchConferenceConfig` which queries the tenant schema's
   `events` table for full details (description, dates, sponsors, stream URL).

## Fixes Applied in This Session (Webapp-related)

| File | Fix |
|------|-----|
| `src/services/localService.js:36,41` | Wrapped `localStorage.setItem` and `removeItem` in try/catch |
