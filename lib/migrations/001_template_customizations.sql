-- Run once against the same Neon DB the main app uses.
-- This table is shared across all template subdomains; template_id
-- discriminates per-template configs for a given user.

CREATE TABLE IF NOT EXISTS template_customizations (
  workos_user_id text        NOT NULL,
  template_id    text        NOT NULL,
  config         jsonb       NOT NULL,
  updated_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workos_user_id, template_id)
);
