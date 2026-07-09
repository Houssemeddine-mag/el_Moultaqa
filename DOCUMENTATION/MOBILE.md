# Mobile App (`Mobile/`)

> Cross-platform Flutter mobile app for conference attendees. Features:
> auth, program schedule, live stream, profile management, feedback,
> notifications, and keynote speaker browsing.

---

## Tech Stack

- **Framework:** Flutter 3.32.x
- **Language:** Dart 3.4+
- **Auth:** Clerk (`clerk_flutter` package)
- **Database:** Supabase (`supabase_flutter`)
- **State:** `setState` (no external state management)
- **Build:** GitHub Actions CI (release APK)

## Pages (13)

| File | Purpose |
|------|---------|
| `home_page.dart` | Conference home — hero card, countdown, stats, upcoming sessions |
| `program_page.dart` | Full program schedule by day |
| `live_page.dart` | Live stream player (HLS) |
| `stream_player_page.dart` | Dedicated stream player with questions panel |
| `auth_page.dart` | Clerk sign-in (OAuth + email/password) + guest mode |
| `profile_page.dart` | User profile — name, email, avatar, organization, education level, gender, birthday, country/province |
| `notification_page.dart` | Notifications list |
| `settings_page.dart` | App settings — notifications toggle, privacy, language, cache, logout |
| `keynote_speakers_page.dart` | Keynote speaker grid with bio dialogs |
| `keynote_speakers.dart` | Alternate keynote view |
| `settings_page.dart` | App settings |
| `resolve_page.dart` | Org slug resolver — JWT decoder, navigates to auth or home |
| `direct_page.dart` | Direct questions/messaging |
| `presentation_feedback.dart` | Session rating/feedback form |

## Key Files

| File | Purpose |
|------|---------|
| `lib/main.dart` | App entry — initializes Supabase + Clerk, builds MaterialApp with sidebar + bottom nav, manages notification count across pages |
| `lib/services/supabase_service.dart` | Singleton Supabase client — Clerk JWT integration, `resolveOrg()`, `org_query/insert/update/delete` wrappers |
| `lib/mobile_config.dart` | **Auto-generated** by CI — org-specific branding (app name, slug, theme color, logo URL) |
| `lib/theme.dart` | ThemeData configuration |
| `lib/theme_utils.dart` | `parseThemeColor()` — safely parses hex color strings |
| `lib/widgets/sidebar.dart` | Navigation drawer (home, program, live, notifications, profile, settings, ratings) |
| `lib/widgets/notification_bell.dart` | Notification badge widget |

## Data Flow

1. App starts → `main.dart` initializes `SupabaseService` + Clerk
2. `SplashScreen` → runs `resolveOrg()` which calls `resolve_org_slug` RPC
3. On success → checks `orgDetails` for valid response → navigates to home
4. All subsequent data goes through `SupabaseService.queryOrgTable()` → `org_query` RPC

## Fixes Applied in This Session (Mobile-related)

| Category | Files | Details |
|----------|-------|---------|
| **C13-new (mounted guards)** | `auth_page.dart`, `home_page.dart`, `profile_page.dart`, `settings_page.dart`, `keynote_speakers_page.dart` | 11 `setState()` calls after `await` now guarded by `if (mounted)` — prevents crash on disposed widget |
| **M-2 (unsafe cast)** | `resolve_page.dart:85` | `as Map<String, dynamic>` → `Map<String, dynamic>.from(...)` — prevents TypeError on non-Map JSON |
