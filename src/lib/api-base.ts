import { getMarketingUrl } from "@/lib/domains";

/**
 * API base URL for fetch calls.
 * - Dev: empty string → Vite proxies /api to localhost:3001
 * - Prod: VITE_API_URL, or marketing host (tapme.rw) where /api is proxied to the backend
 *
 * me.tapme.rw does not proxy /api itself, so public profile pages must call the API on tapme.rw.
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL as string | undefined;
  if (configured?.trim()) {
    return configured.trim().replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return "";
  }

  return getMarketingUrl("").replace(/\/$/, "");
}
