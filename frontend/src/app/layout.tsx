import type { Metadata } from "next";
import { AppThemeProvider } from "@/theme/ThemeProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "BizTracker | Expense & Profit Tracker",
  description: "Business Expense & Profit Tracker for two partners",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </AppThemeProvider>
      </body>
    </html>
  );
}
