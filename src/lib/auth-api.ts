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

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    profileSlug: string;
  };
  profile: UserProfile;
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

export function loginWithEmail(email: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function loginWithGoogle(credential: string) {
  return request<AuthResponse>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export function resetPassword(email: string, newPassword: string) {
  return request<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, newPassword }),
  });
}

export function registerAccount(fullName: string, email: string, password: string) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password }),
  });
}

export function getMe() {
  return request<{
    user: AuthResponse["user"];
    profile: AuthResponse["profile"];
  }>("/api/auth/me");
}

export function changePassword(currentPassword: string, newPassword: string) {
  return request<{ message: string }>("/api/auth/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
