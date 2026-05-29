import type { Metadata } from "next";
import { FONT_VARS } from "@/lib/fonts";
import { CustomizeProvider } from "@/components/customize/CustomizeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FY26 Strategic Plan — Template 04",
  description:
    "An editorial-warm presentation template for internal business plans and strategy reviews.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={FONT_VARS}>
      <body className="bg-cream text-ink">
        <CustomizeProvider>{children}</CustomizeProvider>
      </body>
    </html>
  );
}
