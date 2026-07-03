const protocol = import.meta.env.VITE_APP_PROTOCOL ?? (import.meta.env.DEV ? "http" : "https");

const publicProfileHost =
  import.meta.env.VITE_PUBLIC_PROFILE_HOST ?? (import.meta.env.DEV ? "me.localhost:8080" : "me.tapme.rw");

const dashboardHost =
  import.meta.env.VITE_DASHBOARD_HOST ?? (import.meta.env.DEV ? "profile.localhost:8080" : "profile.tapme.rw");

const adminDashboardHost =
  import.meta.env.VITE_ADMIN_DASHBOARD_HOST ?? (import.meta.env.DEV ? "dash.localhost:8081" : "dash.tapme.rw");

const marketingHost =
  import.meta.env.VITE_MARKETING_HOST ?? (import.meta.env.DEV ? "localhost:8080" : "tapme.rw");

export const domains = {
  publicProfile: publicProfileHost,
  dashboard: dashboardHost,
  adminDashboard: adminDashboardHost,
  marketing: marketingHost,
  protocol,
};

export function getCurrentHost(): string {
  if (typeof window === "undefined") return "";
  return window.location.host;
}

function hostsMatch(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

export function isSubdomainRoutingEnabled(): boolean {
  const { publicProfile, dashboard, adminDashboard, marketing } = domains;
  const hosts = [publicProfile, dashboard, adminDashboard, marketing].map((host) => host.toLowerCase());
  return new Set(hosts).size > 1;
}

export function isPublicProfileHost(host = getCurrentHost()): boolean {
  if (!isSubdomainRoutingEnabled()) return true;
  return hostsMatch(host, domains.publicProfile);
}

export function isDashboardHost(host = getCurrentHost()): boolean {
  if (!isSubdomainRoutingEnabled()) return true;
  return hostsMatch(host, domains.dashboard);
}

export function isMarketingHost(host = getCurrentHost()): boolean {
  if (!isSubdomainRoutingEnabled()) return true;
  return hostsMatch(host, domains.marketing);
}

export function isAdminDashboardHost(host = getCurrentHost()): boolean {
  if (!isSubdomainRoutingEnabled()) return true;
  return hostsMatch(host, domains.adminDashboard);
}

export function getHostUrl(host: string, path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${domains.protocol}://${host}${normalizedPath}`;
}

export function getProfileUrl(slug: string): string {
  return getHostUrl(domains.publicProfile, `/${slug}`);
}

export function getDashboardUrl(path = "/"): string {
  return getHostUrl(domains.dashboard, path);
}

export function normalizeDashboardPath(pathname: string): string {
  if (!pathname.startsWith("/dashboard")) return pathname;
  return pathname.replace(/^\/dashboard\/?/, "/") || "/";
}

export function getAdminDashboardUrl(path = "/"): string {
  return getHostUrl(domains.adminDashboard, path);
}

export function getMarketingUrl(path = "/"): string {
  return getHostUrl(domains.marketing, path);
}

export const RESERVED_PROFILE_SLUGS = new Set([
  "dashboard",
  "profile",
  "billing",
  "settings",
  "register",
  "signin",
  "api",
  "health",
  "features",
  "pricing",
  "how-it-works",
  "business",
  "contact",
  "admin",
]);
