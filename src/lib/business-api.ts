import type { BusinessDashboardData, BusinessOffer } from "@/lib/business";
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

export function submitBusinessRequest(input: {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  teamSize: number;
  message?: string;
}) {
  return request<{ request: BusinessDashboardData["requests"][0]; account: BusinessDashboardData["account"] }>(
    "/api/business/requests",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function getMyBusiness() {
  return request<BusinessDashboardData>("/api/business/me");
}

export function activateBusinessAccount() {
  return request<BusinessDashboardData>("/api/business/me/activate", { method: "POST" });
}

export function updateBusinessAccount(updates: {
  companyName?: string;
  contactName?: string;
  contactPhone?: string;
  website?: string;
}) {
  return request<BusinessDashboardData>("/api/business/me", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function updateBusinessOffer(offer: Partial<BusinessOffer>) {
  return request<BusinessDashboardData>("/api/business/me/offer", {
    method: "PATCH",
    body: JSON.stringify(offer),
  });
}

export function addBusinessTeamMember(input: {
  fullName: string;
  email?: string;
  jobTitle?: string;
  profileSlug?: string;
}) {
  return request<BusinessDashboardData>("/api/business/me/team", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function removeBusinessTeamMember(id: string) {
  return request<BusinessDashboardData>(`/api/business/me/team/${id}`, {
    method: "DELETE",
  });
}

export function getPublicBusinessOffer(slug: string) {
  return request<{ offer: BusinessOffer | null; companyName?: string }>(
    `/api/business/profiles/${slug}/offer`,
  );
}
