import { sql } from "./neon";
import type { CustomizeConfig } from "./customize";
import { normalizeConfig } from "./customize-schema";

const TEMPLATE_ID = "template-01";

export async function getCustomization(workosUserId: string): Promise<CustomizeConfig | null> {
  const rows = (await sql`
    SELECT config
      FROM template_customizations
     WHERE user_id = ${workosUserId}
       AND template_id    = ${TEMPLATE_ID}
     LIMIT 1
  `) as unknown as Array<{ config: unknown }>;
  const raw = rows[0]?.config;
  if (raw == null) return null;
  // Normalize so older DB rows missing newer top-level slices (e.g. typography)
  // get defaulted instead of leaving fields undefined for the renderer.
  return normalizeConfig(raw);
}

export async function saveCustomization(
  workosUserId: string,
  config: CustomizeConfig,
): Promise<void> {
  await sql`
    INSERT INTO template_customizations (user_id, template_id, config, updated_at)
    VALUES (${workosUserId}, ${TEMPLATE_ID}, ${JSON.stringify(config)}::jsonb, now())
    ON CONFLICT (user_id, template_id)
    DO UPDATE SET config = EXCLUDED.config, updated_at = now()
  `;
}
