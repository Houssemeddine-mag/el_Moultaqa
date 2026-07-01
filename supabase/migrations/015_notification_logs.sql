-- ============================================================================
-- Migration 015: Notification Logs Table
-- ============================================================================
-- Tracks emails sent from the Super Admin Notify page. Used by the
-- send-notification edge function to record delivery status.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notification_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient   TEXT        NOT NULL,
  subject     TEXT        NOT NULL,
  body_preview TEXT,
  provider    TEXT,
  status      TEXT        NOT NULL DEFAULT 'logged'
    CHECK (status IN ('logged', 'sent', 'failed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for querying by recipient
CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient
  ON public.notification_logs (recipient);

-- Index for sorting by recency
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at
  ON public.notification_logs (created_at DESC);
