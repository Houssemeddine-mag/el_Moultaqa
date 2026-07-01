# ElMoultaqa Mobile Backend Documentation

## Overview

The mobile app is designed to use the same backend foundation as the web and admin experiences: a Supabase-powered, tenant-aware platform with per-organization schemas.

This document describes the intended backend architecture for the Flutter app, the current integration status, and the data flows that should be implemented next.

---

## 1. Backend Architecture

### Core idea

The mobile app should communicate with:

- the shared public schema for platform-level data such as organizations and plans
- the active organization schema for conference-specific data such as events, sessions, speakers, users, and notifications

### Recommended flow

Flutter app -> Supabase client -> organization-aware RPCs / queries -> tenant-specific data

This keeps the mobile app aligned with the existing multi-tenant backend model used by the other ElMoultaqa clients.

---

## 2. Current Status

At the moment, the mobile app is mostly UI-focused and uses local/demo-style configuration values in the app layer.

The backend integration is not fully wired yet, and the app should be updated to:

- initialize a Supabase client
- resolve the current conference/organization context
- load conference and attendee data from the backend instead of static placeholders

---

## 3. Authentication and Tenant Context

### Authentication model

The mobile experience should use the same organization-aware authentication model as the rest of the platform.

Expected behavior:

- the user signs in through the platform identity flow
- the app resolves the active organization/conference context
- Supabase requests are scoped to the correct organization schema

### Important backend rule

All organization-scoped requests must be validated against the current tenant context so users can only access the data belonging to their conference organization.

---

## 4. Data Domains

### 4.1 Organization metadata

Used for:

- conference identity
- branding
- logo and domain information
- tenant routing

Source:

- public.organizations

### 4.2 Conference data

Used for:

- event title and description
- dates and location
- cover image and settings

Source:

- organization schema: events

### 4.3 Schedule and sessions

Used for:

- program timeline
- session details
- speaker associations
- room and time information

Source:

- organization schema: sessions

### 4.4 Speakers and keynotes

Used for:

- keynote speaker cards
- speaker bios
- profile images

Source:

- organization schema: speakers

### 4.5 Attendee profile

Used for:

- profile information
- registration status
- preferences and metadata

Source:

- organization schema: users

### 4.6 Notifications and Q&A

Used for:

- in-app notifications
- live event questions
- attendee interactions

Source:

- organization schema: notifications and questions

---

## 5. Supabase Backend Interfaces

The mobile app should rely on the same backend interfaces already used by the web stack where possible.

### Recommended Supabase functions

- resolve_org_slug
  - resolves a conference slug to the correct organization details

- org_query
  - reads data from the active organization schema safely

- org_insert / org_update / org_delete
  - used for tenant-safe create/update/delete operations when needed

### Recommended table access

- organizations (public schema)
- events
- sessions
- speakers
- users
- notifications
- questions
- tickets

---

## 6. Mobile Integration Plan

### Step 1: Initialize the backend client

Add a Supabase client to the mobile app and initialize it with the correct project URL and anon/service keys.

### Step 2: Resolve the organization context

The app should determine the active conference/organization based on:

- a deep link
- a stored org slug
- the logged-in user’s active organization

### Step 2.5: Mobile launch flow

On startup, the mobile app should follow this launch flow:

1. Check for a saved `org_slug` in local storage / `SharedPreferences`.
2. If one exists, use it to initialize app context and resolve the org immediately.
3. If not, show a configuration screen where the user can enter the slug or scan a QR code.
4. Call `resolve_org_slug` to validate the slug and decrypt the organization details.
5. Save the returned `schema_name` plus any config values to `SharedPreferences`.
6. Initialize app state using the resolved org context.
7. Fetch sessions, speakers, live stream data, and other tenant-specific content.

This flow matches the image: prefer saved org context on launch, then fall back to explicit config entry, then resolve and persist tenant data.

### Step 3: Load conference content

Fetch the basic conference details first, then progressively load:

1. event metadata
2. sessions/program
3. speakers
4. attendee profile
5. notifications

### Step 4: Cache locally

For performance and offline support, cached data should be stored locally after initial fetch.

### Step 5: Keep the UI state synced

Use a state-management layer or service layer to keep the mobile UI in sync with backend changes.

---

## 7. Recommended Implementation Notes

### Best practices

- prefer backend-driven data over hardcoded UI content
- use tenant-aware queries only
- avoid direct access to organization schemas without validation
- keep local caching lightweight and refreshable

### Security expectations

- RLS must remain enforced
- the mobile app should never bypass tenant isolation
- write operations should go through validated backend functions whenever possible

---

## 8. Suggested Next Steps

1. add the mobile Supabase client dependency and initialization code
2. connect the app to the shared organization lookup flow
3. replace static config data with real backend data
4. implement the program/speaker/notification fetchers
5. add local caching and refresh behavior

---

## 9. Summary

The mobile backend for ElMoultaqa should follow the same multi-tenant Supabase architecture as the rest of the platform. The main task is to move the mobile app from static/demo data to real organization-scoped data sourced from the shared backend.
