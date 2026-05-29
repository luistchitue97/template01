import { sql } from "./neon";

/**
 * Does this WorkOS user own the $200 lifetime all-access pass?
 *
 * TODO: replace the query body once the Neon schema is confirmed. Likely shape:
 *   SELECT 1 FROM entitlements
 *    WHERE workos_user_id = $1 AND kind = 'lifetime' AND status = 'active'
 *    LIMIT 1
 * Or, if entitlement is a flag on the users row:
 *   SELECT 1 FROM users WHERE workos_id = $1 AND lifetime_paid_at IS NOT NULL
 */
export async function hasLifetimeAccess(workosUserId: string): Promise<boolean> {
  if (!workosUserId) return false;
  try {
    // Placeholder — uses a parameterized probe against a generic table name.
    // Will be replaced with the real query once the schema is in hand.
    const rows = (await sql`
      SELECT 1
        FROM entitlements
       WHERE workos_user_id = ${workosUserId}
         AND kind = 'lifetime'
         AND status = 'active'
       LIMIT 1
    `) as unknown as Array<Record<string, unknown>>;
    return rows.length > 0;
  } catch (err) {
    // If the table or columns don't exist yet, fail closed: deny access.
    // Logged for the operator; not surfaced to the user.
    console.error("[entitlements] lookup failed", err);
    return false;
  }
}
