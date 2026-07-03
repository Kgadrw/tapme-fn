/**
 * API base URL for fetch calls.
 * - Default: empty string → relative `/api/...` on the current host
 * - Dev: Vite proxies `/api` to localhost:3001
 * - Prod: nginx proxies `/api` on tapme.rw, me.tapme.rw, profile.tapme.rw, etc.
 * - Override: set VITE_API_URL for a dedicated API origin
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL as string | undefined;
  if (configured?.trim()) {
    return configured.trim().replace(/\/$/, "");
  }

  return "";
}
