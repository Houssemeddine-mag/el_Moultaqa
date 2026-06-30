# Mobile App Build Pipeline — Implementation Plan

## Strategy

**Per-conference branded APKs** (Path B). Each conference gets its own APK with its name and logo baked in.

---

## How It Works

### On the Admin (when saving settings)

The `organizations` table has:

```sql
ALTER TABLE public.organizations
  ADD COLUMN mobile_app_url TEXT,           -- download link to the APK
  ADD COLUMN mobile_built_at TIMESTAMPTZ,   -- last successful build time
  ADD COLUMN mobile_config_hash TEXT;       -- hash of (name + logo_url + theme_color) at build time
```

Whenever the admin changes name, logo, or theme color in **Settings**, the app compares the hash of the current config against `mobile_config_hash`. If they differ, the Applications page shows:

```
⚠️ Branding changed since last build — [Rebuild Mobile App]
```

The old APK link stays live until the new build finishes → zero downtime.

---

### Build Trigger (GitHub Actions, free)

In the SuperAdmin or Admin panel, a **"Build Mobile App"** button triggers a GitHub Actions workflow via `workflow_dispatch`:

```
curl -X POST https://api.github.com/repos/org/repo/actions/workflows/build-app.yml/dispatches \
  -H "Authorization: Bearer $GH_PAT" \
  -H "Content-Type: application/json" \
  -d '{"ref":"main","inputs":{"org_slug":"my-conference","app_name":"My Conference","logo_url":"https://...","theme_color":"#0d7e52"}}'
```

The workflow:

1. Checks out the Flutter project
2. Generates `mobile_config.dart` with the inputs
3. Generates adaptive app icons (Android + iOS) from `logo_url`
4. Runs `flutter build apk --release`
5. Uploads the APK to a **GitHub Release** (free hosting)
6. Outputs the download URL → saved to `organizations.mobile_app_url`

**Total cost: $0** (GitHub Actions free tier + GitHub Releases)

---

### The QR Code

Generated client-side in the webapp with `qrcode.react`:

```jsx
npm install qrcode.react

import { QRCodeSVG } from "qrcode.react";

<QRCodeSVG
  value={conferenceConfig.mobileAppUrl}
  size={200}
  level="H"
  bgColor="#fff"
  fgColor={conferenceConfig.themeColor}
/>
```

---

## Pipeline Flow (Simplified)

```
Landing → user launches conference
                ↓
        Success screen shows 3 cards:
          ├── Webapp link (copiable)
          ├── Admin link (copiable)
          └── Mobile app → "Create from Admin → Applications"
                ↓
Admin → Applications page
          ├── Webapp: link + copy button
          ├── Mobile: status + build button
          │     ├── Not built    → [Build Mobile App]
          │     ├── Building...  → spinner + progress
          │     └── Ready        → download link + QR preview
          │
          └── If branding changed since last build:
                ⚠️ "Branding changed — [Rebuild Mobile App]"
                (old APK stays live, new one replaces it when ready)
                ↓
      Build starts → GitHub Actions → APK uploaded
                ↓
      URL saved to organizations.mobile_app_url
                ↓
Webapp → HomePage download section checks mobileAppUrl
          ├── null / empty → section hidden
          └── URL present  → show QR code + download button
                ↓
Attendees scan QR → download branded APK
```

---

## Files to Create / Modify

### Landing

| File                                            | Change                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `Landing/src/pages/ConferenceBuilderPage.jsx` | Add 3rd success card: "Mobile Application — Create from Admin → Applications" |

### Admin

| File                                     | Change                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `admin/src/pages/ApplicationsPage.jsx` | **New page** — webapp link, mobile status, build button                  |
| `admin/src/adminConfig.js`             | Add "Applications" to sidebar nav                                               |
| `admin/src/App.jsx`                    | Add route`/c/:orgSlug/admin/app/applications`                                 |
| `admin/src/backend.js`                 | Add`getMobileBuildStatus()`, `triggerMobileBuild()`, `mobileConfigHash()` |

### Webapp

| File                                         | Change                                                               |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `webapp/src/pages/HomePage.jsx`            | Wrap download section in`{conferenceConfig.mobileAppUrl && (...)}` |
| `webapp/src/services/localService.js`      | Add`mobileAppUrl` to config fetch                                  |
| `webapp/src/context/ConferenceContext.jsx` | Expose`mobileAppUrl` in config                                     |

### Supabase

| File                                       | Change                                         |
| ------------------------------------------ | ---------------------------------------------- |
| `supabase/migrations/014_mobile_app.sql` | Add columns + RPC to get/set mobile build data |

### GitHub Actions

| File                                       | Change                                                  |
| ------------------------------------------ | ------------------------------------------------------- |
| `.github/workflows/build-mobile-app.yml` | **New file** — Flutter build + upload to Release |

---

## Supabase Migration (014_mobile_app.sql)

```sql
ALTER TABLE public.organizations
  ADD COLUMN mobile_app_url TEXT,
  ADD COLUMN mobile_built_at TIMESTAMPTZ,
  ADD COLUMN mobile_config_hash TEXT;

CREATE OR REPLACE FUNCTION public.get_mobile_build_status(p_org_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org public.organizations;
BEGIN
  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  RETURN jsonb_build_object(
    'app_url', v_org.mobile_app_url,
    'built_at', v_org.mobile_built_at,
    'config_hash', v_org.mobile_config_hash
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.set_mobile_build_result(
  p_org_slug TEXT,
  p_app_url TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_config JSONB;
  v_hash TEXT;
  v_org public.organizations;
BEGIN
  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  v_config := jsonb_build_object(
    'name', v_org.name,
    'logo_url', v_org.logo_url,
    'theme_color', (SELECT settings->>'themeColor' FROM organizations WHERE slug = p_org_slug)
  );
  v_hash := encode(digest(v_config::text, 'sha256'), 'hex');

  UPDATE public.organizations
  SET
    mobile_app_url = p_app_url,
    mobile_built_at = now(),
    mobile_config_hash = v_hash
  WHERE slug = p_org_slug;
END;
$$;
```
