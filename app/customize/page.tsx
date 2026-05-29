import { requireUser } from "@/lib/workos";
import { hasLifetimeAccess } from "@/lib/entitlements";
import { CustomizeClient } from "@/components/customize/CustomizeClient";
import { Paywall } from "@/components/customize/Paywall";

export const dynamic = "force-dynamic";

export default async function CustomizePage() {
  const session = await requireUser("/customize");

  if (!(await hasLifetimeAccess(session.user.id))) {
    return <Paywall userEmail={session.user.email} />;
  }

  return <CustomizeClient />;
}
