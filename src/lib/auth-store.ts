import { getCurrentHost, isSubdomainRoutingEnabled } from "@/lib/domains";

const TOKEN_KEY = "tapme-auth-token";
const AUTH_QUERY_PARAM = "auth";
const TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const listeners = new Set<() => void>();

function notifyAuthChange() {
  listeners.forEach((listener) => listener());
}

function getCookieDomain(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const host = window.location.hostname;
  if (host.endsWith(".localhost")) {
    return ".localhost";
  }

  const configured = import.meta.env.VITE_COOKIE_DOMAIN as string | undefined;
  if (configured) return configured;

  if (host === "tapme.rw" || host.endsWith(".tapme.rw")) {
    return ".tapme.rw";
  }

  return undefined;
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  const domain = getCookieDomain();
  const secure = window.location.protocol === "https:";
  let cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
  if (domain) {
    cookie += `; domain=${domain}`;
  }
  if (secure) {
    cookie += "; secure";
  }
  document.cookie = cookie;
}

function deleteCookie(name: string): void {
  writeCookie(name, "", 0);
}

/** Read a one-time auth token from the URL when crossing subdomains (e.g. localhost → profile.localhost). */
export function bootstrapAuthFromUrl(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const token = params.get(AUTH_QUERY_PARAM);
  if (!token) return;

  setAuthToken(token);
  params.delete(AUTH_QUERY_PARAM);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
}

export function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) return stored;
  } catch {
    // ignore
  }

  return readCookie(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore quota errors
  }

  if (isSubdomainRoutingEnabled()) {
    writeCookie(TOKEN_KEY, token, TOKEN_MAX_AGE_SECONDS);
  }

  notifyAuthChange();
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }

  deleteCookie(TOKEN_KEY);
  notifyAuthChange();
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Append auth token to a dashboard URL when navigating across hosts. */
export function withCrossHostAuth(url: string): string {
  if (!isSubdomainRoutingEnabled()) return url;

  const token = getAuthToken();
  if (!token) return url;

  const target = new URL(url);
  if (target.host === getCurrentHost()) return url;

  target.searchParams.set(AUTH_QUERY_PARAM, token);
  return target.toString();
}
