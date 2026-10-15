import { getApiBaseUrl } from "@/lib/api-base";
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

export type AuthUser = {
  id: string;
  email: string;
  profileSlug: string;
};

export type AuthProfile = {
  slug: string;
  fullName?: string;
  displayName?: string;
  [key: string]: unknown;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
  profile: AuthProfile;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the TapMe API. Make sure the backend is running on port 3001.",
    );
  }

  const raw = await response.text();
  let payload: ApiSuccess<T> | ApiError | null = null;

  if (raw.trim()) {
    try {
      payload = JSON.parse(raw) as ApiSuccess<T> | ApiError;
    } catch {
      throw new Error(
        response.ok
          ? "The server returned an invalid response."
          : `Request failed (${response.status}). Is the backend running?`,
      );
    }
  }

  if (!response.ok || !payload || !payload.success) {
    const message =
      payload && !payload.success
        ? payload.error.message
        : response.status === 502 || response.status === 504 || response.status === 500
          ? "Cannot reach the TapMe API. Make sure the backend is running on port 3001."
          : `Request failed (${response.status || "network error"}).`;
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

export function registerAccount(fullName: string, email: string, password: string) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password }),
  });
}

export function resetPassword(email: string, newPassword: string) {
  return request<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, newPassword }),
  });
}

export function getMe() {
  return request<{ user: AuthUser; profile: AuthProfile }>("/api/auth/me");
}

export function changePassword(currentPassword: string, newPassword: string) {
  return request<{ message: string }>("/api/auth/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
