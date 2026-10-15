import type { UserProfile } from "@/lib/profile";
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
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

export type ImagePreviewResponse = {
  previewUrl: string;
  publicId: string;
};

export type ImageUploadResponse = {
  url: string;
  profile: UserProfile;
};

export function uploadImagePreview(file: File) {
  const form = new FormData();
  form.append("image", file);

  return request<ImagePreviewResponse>("/api/uploads/preview", {
    method: "POST",
    body: form,
  });
}

export function uploadAvatarImage(file: File, previewPublicId?: string) {
  const form = new FormData();
  form.append("image", file);
  if (previewPublicId) {
    form.append("previewPublicId", previewPublicId);
  }

  return request<ImageUploadResponse>("/api/uploads/avatar", {
    method: "POST",
    body: form,
  });
}

export function removeAvatarImage() {
  return request<{ profile: UserProfile }>("/api/uploads/avatar", {
    method: "DELETE",
  });
}

export function uploadCoverImage(file: File, previewPublicId?: string) {
  const form = new FormData();
  form.append("image", file);
  if (previewPublicId) {
    form.append("previewPublicId", previewPublicId);
  }

  return request<ImageUploadResponse>("/api/uploads/cover", {
    method: "POST",
    body: form,
  });
}

export function removeCoverImage() {
  return request<{ profile: UserProfile }>("/api/uploads/cover", {
    method: "DELETE",
  });
}
