import { sql } from "./neon";
import type { CustomizeConfig } from "./customize";

const TEMPLATE_ID = "template-01";

export async function getCustomization(workosUserId: string): Promise<CustomizeConfig | null> {
  const rows = (await sql`
    SELECT config
      FROM template_customizations
     WHERE workos_user_id = ${workosUserId}
       AND template_id    = ${TEMPLATE_ID}
     LIMIT 1
  `) as unknown as Array<{ config: CustomizeConfig }>;
  return rows[0]?.config ?? null;
}

export async function saveCustomization(
  workosUserId: string,
  config: CustomizeConfig,
): Promise<void> {
  await sql`
    INSERT INTO template_customizations (workos_user_id, template_id, config, updated_at)
    VALUES (${workosUserId}, ${TEMPLATE_ID}, ${JSON.stringify(config)}::jsonb, now())
    ON CONFLICT (workos_user_id, template_id)
    DO UPDATE SET config = EXCLUDED.config, updated_at = now()
  `;
}
