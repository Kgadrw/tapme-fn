/**
 * API base URL for fetch calls.
 * Empty in local dev → Vite proxies `/api` to localhost:3001.
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL as string | undefined;
  if (configured?.trim()) {
    return configured.trim().replace(/\/$/, "");
  }
  return "";
}
