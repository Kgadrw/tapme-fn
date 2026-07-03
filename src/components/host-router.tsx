import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  getAdminDashboardUrl,
  getDashboardUrl,
  getMarketingUrl,
  getProfileUrl,
  isDashboardHost,
  isMarketingHost,
  isPublicProfileHost,
  isSubdomainRoutingEnabled,
  normalizeDashboardPath,
} from "@/lib/domains";
import { goToUrl } from "@/lib/navigation";

export function HostRouter() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (!isSubdomainRoutingEnabled()) return;

    if (isDashboardHost()) {
      if (pathname.startsWith("/dashboard")) {
        goToUrl(getDashboardUrl(normalizeDashboardPath(pathname)), true);
        return;
      }

      if (pathname === "/signin") {
        goToUrl(getMarketingUrl("/signin"), true);
        return;
      }

      if (pathname.startsWith("/u/")) {
        const slug = pathname.slice(3);
        if (slug) goToUrl(getProfileUrl(slug), true);
      }
      return;
    }

    if (isPublicProfileHost()) {
      if (pathname === "/") {
        goToUrl(getMarketingUrl("/"), true);
      }
      return;
    }

    if (isMarketingHost() && pathname.startsWith("/u/")) {
      const slug = pathname.slice(3);
      if (slug) goToUrl(getProfileUrl(slug), true);
      return;
    }

    if (isMarketingHost() && pathname.startsWith("/dashboard")) {
      goToUrl(getDashboardUrl(normalizeDashboardPath(pathname)), true);
      return;
    }

    if (isMarketingHost() && pathname.startsWith("/admin")) {
      const nextPath = pathname.replace(/^\/admin\/dashboard\/?/, "/") || "/";
      goToUrl(getAdminDashboardUrl(nextPath), true);
    }
  }, [pathname]);

  return null;
}
