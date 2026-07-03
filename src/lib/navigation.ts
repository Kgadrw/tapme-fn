import { getCurrentHost, getAdminDashboardUrl, getDashboardUrl, getMarketingUrl, isAdminDashboardHost, isDashboardHost } from "@/lib/domains";
import { withCrossHostAuth } from "@/lib/auth-store";

export function goToUrl(url: string, replace = false): void {
  if (replace) {
    window.location.replace(url);
    return;
  }
  window.location.assign(url);
}

export function goToDashboard(path = "/"): void {
  const url = withCrossHostAuth(getDashboardUrl(path));
  if (isDashboardHost() && window.location.pathname === path && !url.includes("auth=")) return;
  goToUrl(url);
}

export function goToAdminDashboard(path = "/"): void {
  const url = getAdminDashboardUrl(path);
  if (isAdminDashboardHost() && window.location.pathname === path) return;
  goToUrl(url);
}

export function goToMarketing(path = "/"): void {
  const url = getMarketingUrl(path);
  if (getCurrentHost() && url.startsWith(`${window.location.protocol}//${getCurrentHost()}`) && window.location.pathname === path) {
    return;
  }
  goToUrl(url);
}
