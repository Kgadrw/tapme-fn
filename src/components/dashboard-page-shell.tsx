import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function DashboardPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="g-console min-h-screen">
      <div className="flex min-h-screen flex-col md:flex-row">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col md:ml-64">
          <main className="min-w-0 flex-1">
            <div className="w-full px-4 py-6 md:px-8 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
