# Auth UI Redesign — Google + GitHub One-Tap

## Goal
Replace the default `ClerkAuthentication()` form (email/password + small OAuth icons) with a modern, branded sign-in page like ChatGPT/Claude — just two buttons: **Continue with Google** and **Continue with GitHub**. No email/password fields.

## Design

```
┌──────────────────────────────────┐
│                                  │
│            (Logo)                │
│                                  │
│       Welcome to                 │
│    [MobileConfig.appName]    ← org name, dynamic
│                                  │
│    ┌────────────────────────┐    │
│    │  G  Continue with      │    │
│    │     Google             │    │  ← ssoSignIn(oauthGoogle)
│    └────────────────────────┘    │
│                                  │
│    ┌────────────────────────┐    │
│    │ GH  Continue with      │    │
│    │     GitHub             │    │  ← ssoSignIn(oauthGithub)
│    └────────────────────────┘    │
│                                  │
│    By continuing, you agree      │
│    to Terms of Service           │
└──────────────────────────────────┘
```

### Visual Specs
| Element | Style |
|---|---|
| Background | White `#FFFFFF` |
| Logo | `global/logo.png`, 80×80, rounded 20px |
| Heading | "Welcome to" (grey 14px) + org name (theme color 24px bold) |
| Buttons | White bg, 1px `#DADCE0` border, 16px radius, full-width, 48px height |
| Google icon | Blue "G" `#4285F4` in white circle |
| GitHub icon | White "GH" in dark `#24292F` circle |
| Button text | `#1F1F1F`, 16px medium |
| Terms text | `#9CA3AF`, 12px |

## Dynamic Org Branding
- **App name** — `MobileConfig.appName` (loaded in `main.dart` from Supabase)
- **Theme accent** — `MobileConfig.themeColor` for button border/accents
- **Logo** — `MobileConfig.logoUrl` if available, else fallback to `global/logo.png`
- Falls back to static defaults if org not resolved yet

## File Changes

### `Mobile/lib/pages/auth_page.dart`
- Replace `ClerkAuthentication()` (2 occurrences: `signedOutBuilder` + `builder`) with `_SocialSignInPage(authState:)`
- Add `_SocialSignInPage` widget — branded layout with Google + GitHub buttons
- Add `_SocialButton` widget — reusable full-width social button
- Keep all existing code: `_OrgGate`, `_NoOrgScreen`, `_tryResolveOrg()`, `signingInBuilder`, `signingUpBuilder`, `signedInBuilder`

### Files not changed
- `Mobile/pubspec.yaml` — no new deps needed
- `Mobile/lib/main.dart` — no changes
- `Mobile/lib/mobile_config.dart` — no changes

## Auth Flow
1. App opens → Clerk loading spinner (`ClerkAuthConfig.loading`)
2. Clerk resolves → signed out → `_SocialSignInPage` renders with Google + GitHub
3. User taps **Google** → `authState.ssoSignIn(context, clerk.Strategy.oauthGoogle)` → in-app WebView → Google account picker → user taps account → signed in
4. User taps **GitHub** → `authState.ssoSignIn(context, clerk.Strategy.oauthGithub)` → same flow
5. → `ClerkAuthBuilder.signedInBuilder` fires → `_OrgGate` checks membership → `/main` or `_NoOrgScreen`

## Why Option A (WebView)
- Uses Clerk's built-in `ssoSignIn` — no extra packages
- Works with dev Clerk instance over USB
- No Google Cloud project or OAuth client IDs needed
- Google shows "Choose an account" in WebView (no password typing)
