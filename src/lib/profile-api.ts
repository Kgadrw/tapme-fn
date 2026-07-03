import type { UserProfile } from "@/lib/profile";
import { getAuthToken } from "@/lib/auth-store";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

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

export function getPublicProfile(slug: string) {
  return request<UserProfile>(`/api/profiles/${slug}`);
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
