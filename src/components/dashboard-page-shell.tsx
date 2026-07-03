import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function DashboardPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col md:flex-row">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 md:ml-[17rem]">
          <div className="w-full px-6 py-10 md:px-10 md:py-14">{children}</div>
        </main>
      </div>
    </div>
  );
}
