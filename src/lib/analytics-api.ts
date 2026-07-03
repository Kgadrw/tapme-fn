import type { InsightPeriod, InsightPeriodData } from "@/lib/insights";
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

export type InsightsResponse = InsightPeriodData & {
  period: InsightPeriod;
  eventCount: number;
};

export function getInsights(period: InsightPeriod) {
  return request<InsightsResponse>(`/api/insights?period=${period}`);
}

export function recordProfileEvent(
  slug: string,
  input: { type: "view" | "tap" | "contact_save" | "link_click"; linkLabel?: string },
) {
  const API_BASE = import.meta.env.VITE_API_URL ?? "";
  const token = getAuthToken();

  return fetch(`${API_BASE}/api/profiles/${encodeURIComponent(slug)}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error("Failed to record event");
    }
  });
}
