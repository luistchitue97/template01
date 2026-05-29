-- Run once against the same Neon DB the main app uses (luistchitue.com).
-- Shared across all template subdomains; template_id discriminates per-template
-- configs for a given user. user_id mirrors the FK pattern of `purchases`.

CREATE TABLE IF NOT EXISTS template_customizations (
  user_id     text        NOT NULL,
  template_id text        NOT NULL,
  config      jsonb       NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, template_id),
  CONSTRAINT template_customizations_user_id_app_users_id_fk
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);
