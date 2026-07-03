import { getApiBaseUrl } from "@/lib/api-base";

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
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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

export function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return request<{ message: string; id: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
