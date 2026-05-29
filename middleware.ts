import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

// Runs on the gated surfaces so the WorkOS session cookie is decrypted and
// refreshed if needed. We do NOT enable middleware-level redirects — the
// page server component decides what to do (redirect to main app sign-in,
// render the paywall, or render the editor).
export default authkitMiddleware();

// Run on every page/api route so the WorkOS session cookie is refreshed
// wherever it's read. Static assets are excluded.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
