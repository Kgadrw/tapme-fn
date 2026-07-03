import { getApiBaseUrl } from "@/lib/api-base";
import { normalizeProfileSlug } from "@/lib/domains";
import type { UserProfile } from "@/lib/profile";
import { getAuthToken } from "@/lib/auth-store";

const API_BASE = getApiBaseUrl();

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiError = {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;
  if (!response.ok || !payload.success) {
    const message = payload.success ? "Request failed" : payload.error.message;
    throw new Error(message);
  }

  return payload.data;
}

/** Public read — no auth header so anyone can load profiles on me.tapme.rw. */
async function publicRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;
  if (!response.ok || !payload.success) {
    const message = payload.success ? "Request failed" : payload.error.message;
    throw new Error(message);
  }

  return payload.data;
}

export function getPublicProfile(slug: string) {
  const normalized = normalizeProfileSlug(slug);
  return publicRequest<UserProfile>(`/api/profiles/${encodeURIComponent(normalized)}`);
}

export function getMyProfile() {
  return request<UserProfile>("/api/profiles/me/profile");
}

export async function isSlugAvailable(slug: string, excludeSlug?: string) {
  const normalized = slug.trim().toLowerCase();
  if (!normalized || normalized === excludeSlug) {
    return normalized === excludeSlug;
  }

  try {
    await getPublicProfile(normalized);
    return false;
  } catch {
    return true;
  }
}

export function updateMyProfile(updates: Partial<UserProfile>) {
  return request<UserProfile>("/api/profiles/me/profile", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}
