import { sql } from "./neon";

/**
 * Does this WorkOS user own the $200 lifetime all-access pass?
 *
 * The main app's Stripe webhook inserts one row into `purchases` per
 * completed checkout; a row's existence with kind = 'all_access' is the
 * entitlement. `purchases.user_id` references `app_users.id`, which holds
 * the WorkOS user id directly.
 */
export async function hasLifetimeAccess(workosUserId: string): Promise<boolean> {
  if (!workosUserId) return false;
  try {
    const rows = (await sql`
      SELECT 1
        FROM purchases
       WHERE user_id = ${workosUserId}
         AND kind    = 'all_access'
       LIMIT 1
    `) as unknown as Array<Record<string, unknown>>;
    return rows.length > 0;
  } catch (err) {
    // Fail closed if the DB is unreachable. Logged for the operator.
    console.error("[entitlements] lookup failed", err);
    return false;
  }
}
