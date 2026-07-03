import { createFileRoute, Outlet } from "@tanstack/react-router";

import { BusinessDashboardSidebar } from "@/components/business-dashboard-sidebar";

export const Route = createFileRoute("/business/dashboard")({
  head: () => ({
    meta: [
      { title: "Business Dashboard — tapme" },
      { name: "description", content: "Manage team profiles and your business offer on tapme." },
    ],
  }),
  component: BusinessDashboardLayout,
});

function BusinessDashboardLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col md:flex-row">
        <BusinessDashboardSidebar />
        <main className="min-w-0 flex-1 md:ml-[17rem]">
          <div className="w-full px-6 py-10 md:px-10 md:py-14">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
