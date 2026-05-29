import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";

const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "https://luistchitue.com";
const TEMPLATE_URL = process.env.NEXT_PUBLIC_TEMPLATE_URL ?? "https://template01.luistchitue.com";

/**
 * Build the URL on the main app that initiates the WorkOS sign-in flow and
 * sends the user back here when complete.
 */
export function buildSignInRedirect(returnPathname: string): string {
  const returnTo = `${TEMPLATE_URL}${returnPathname.startsWith("/") ? returnPathname : `/${returnPathname}`}`;
  return `${MAIN_APP_URL}/sign-in?returnTo=${encodeURIComponent(returnTo)}`;
}

/**
 * Server-side: require an authenticated user. If absent, redirect to the main
 * app's sign-in page. Returns the WorkOS UserInfo when present.
 */
export async function requireUser(returnPathname: string) {
  const session = await withAuth();
  if (!session.user) {
    redirect(buildSignInRedirect(returnPathname));
  }
  return session;
}

export { withAuth };
