-- ============================================================================
-- Migration 001: Public Schema Tables
-- ============================================================================
-- Creates the shared tables that live in the `public` schema.
-- These are global to the platform — NOT per-organization.
-- ============================================================================

-- Enable UUID generation (idempotent)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- public.organizations
-- Master registry of every tenant on the platform.
-- Each row maps to one Clerk organization and one Postgres schema.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id    TEXT        UNIQUE NOT NULL,   -- Clerk org ID, e.g. "org_2abc123"
  name            TEXT        NOT NULL,
  slug            TEXT        UNIQUE NOT NULL,    -- URL-safe identifier for path-prefix routing
  schema_name     TEXT        UNIQUE NOT NULL,    -- Postgres schema, e.g. "org_2abc123"
  owner_clerk_id  TEXT        NOT NULL,           -- Clerk user ID of the org creator
  logo_url        TEXT,
  domain          TEXT,                           -- Optional custom domain
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookups by slug (used on every request to resolve tenant)
CREATE INDEX IF NOT EXISTS idx_organizations_slug
  ON public.organizations (slug);

-- Fast lookups by Clerk org ID (used by webhook handler)
CREATE INDEX IF NOT EXISTS idx_organizations_clerk_org_id
  ON public.organizations (clerk_org_id);

-- ---------------------------------------------------------------------------
-- public.plans
-- Available subscription tiers. Rows are managed by platform admins.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plans (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT    UNIQUE NOT NULL,         -- "free", "pro", "enterprise"
  display_name    TEXT    NOT NULL,                 -- "Free", "Pro", "Enterprise"
  max_events      INT     NOT NULL DEFAULT 1,       -- Max conferences per org
  max_speakers    INT     NOT NULL DEFAULT 5,
  max_sessions    INT     NOT NULL DEFAULT 10,
  price_cents     INT     NOT NULL DEFAULT 0,       -- Price in smallest currency unit
  currency        TEXT    NOT NULL DEFAULT 'DZD',    -- ISO 4217 (Algerian Dinar default)
  features        JSONB   NOT NULL DEFAULT '{}',     -- Feature flags, e.g. {"live_streaming": true}
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- public.subscriptions
-- Links an organization to a plan. One active subscription per org.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id         UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id                 UUID        NOT NULL REFERENCES public.plans(id),
  status                  TEXT        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  chargily_subscription_id TEXT,                    -- Chargily payment ID (nullable until integrated)
  chargily_customer_id    TEXT,                      -- Chargily customer ID
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One active subscription per organization
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_active_org
  ON public.subscriptions (organization_id)
  WHERE status = 'active';

-- ---------------------------------------------------------------------------
-- Seed default plans
-- ---------------------------------------------------------------------------
INSERT INTO public.plans (name, display_name, max_events, max_speakers, max_sessions, price_cents, currency, features)
VALUES
  ('free',       'Free',       1,  5,   10,  0,     'DZD', '{"live_streaming": false, "custom_domain": false, "analytics": false}'),
  ('pro',        'Pro',        5,  25,  50,  5000,  'DZD', '{"live_streaming": true, "custom_domain": false, "analytics": true}'),
  ('enterprise', 'Enterprise', -1, -1,  -1,  15000, 'DZD', '{"live_streaming": true, "custom_domain": true, "analytics": true}')
ON CONFLICT (name) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Updated_at trigger (reusable for any table)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
