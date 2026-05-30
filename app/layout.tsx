import type { Metadata } from "next";
import { FONT_VARS } from "@/lib/fonts";
import { CustomizeProvider } from "@/components/customize/CustomizeProvider";
import { MobileGate } from "@/components/ui/MobileGate";
import { withAuth } from "@/lib/workos";
import { hasLifetimeAccess } from "@/lib/entitlements";
import { getCustomization } from "@/lib/customizations-repo";
import type { CustomizeConfig } from "@/lib/customize";
import "./globals.css";

export const metadata: Metadata = {
  title: "FY26 Strategic Plan — Template 04",
  description:
    "An editorial-warm presentation template for internal business plans and strategy reviews.",
};

async function loadInitialServerConfig(): Promise<CustomizeConfig | null> {
  try {
    const session = await withAuth();
    if (!session.user) return null;
    if (!(await hasLifetimeAccess(session.user.id))) return null;
    return await getCustomization(session.user.id);
  } catch {
    // DB or session errors must not break the deck render for guests.
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialServerConfig = await loadInitialServerConfig();

  return (
    <html lang="en" className={FONT_VARS}>
      <body className="bg-cream text-ink">
        <CustomizeProvider initialServerConfig={initialServerConfig}>
          {children}
        </CustomizeProvider>
        <MobileGate />
      </body>
    </html>
  );
}
