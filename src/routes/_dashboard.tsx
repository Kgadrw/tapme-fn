import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DashboardGate } from "@/components/dashboard-gate";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { getDashboardUrl, getMarketingUrl, isDashboardHost, isSubdomainRoutingEnabled } from "@/lib/domains";
import { bootstrapAuthFromUrl, isAuthenticated } from "@/lib/auth-store";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: ({ location }) => {
    bootstrapAuthFromUrl();
    if (isSubdomainRoutingEnabled() && !isDashboardHost()) {
      throw redirect({ href: getDashboardUrl(location.pathname), replace: true });
    }
    if (!isAuthenticated()) {
      throw redirect({ href: getMarketingUrl("/register"), replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard — tapme" },
      { name: "description", content: "Manage your tapme digital profile." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <DashboardGate>
      <DashboardPageShell>
        <Outlet />
      </DashboardPageShell>
    </DashboardGate>
  );
}
