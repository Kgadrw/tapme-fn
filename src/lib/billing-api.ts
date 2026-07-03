import type { MobileMoneyProvider, SubscriptionPlan } from "@/lib/billing";
import { DEFAULT_SUBSCRIPTION_PLAN } from "@/lib/billing";
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

export type PaymentTransaction = {
  ref: string;
  amount: number;
  status: "pending" | "successful" | "failed";
  number: string;
  provider?: string;
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

export function initiateSubscriptionPayment(input: {
  number: string;
  provider: MobileMoneyProvider;
}) {
  return request<PaymentTransaction>("/api/billing/subscribe", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getPaymentTransaction(ref: string) {
  return request<PaymentTransaction>(`/api/billing/transactions/${ref}`);
}

export function fetchSubscriptionPlan() {
  return request<SubscriptionPlan>("/api/billing/plan");
}

let cachedPlan: SubscriptionPlan | null = null;
let planPromise: Promise<SubscriptionPlan> | null = null;

export function getCachedSubscriptionPlan() {
  return cachedPlan ?? DEFAULT_SUBSCRIPTION_PLAN;
}

export async function loadSubscriptionPlan() {
  if (cachedPlan) return cachedPlan;
  if (!planPromise) {
    planPromise = fetchSubscriptionPlan()
      .then((plan) => {
        cachedPlan = plan;
        return plan;
      })
      .catch(() => DEFAULT_SUBSCRIPTION_PLAN)
      .finally(() => {
        planPromise = null;
      });
  }
  return planPromise;
}

export type SubscriptionStatusResponse = {
  status: "active" | "inactive";
  planId: string;
  provider?: string;
  phone?: string;
  activatedAt?: string;
  renewsAt?: string;
};

export function getSubscriptionStatus() {
  return request<SubscriptionStatusResponse>("/api/billing/subscription");
}

export function cancelSubscriptionApi() {
  return request<SubscriptionStatusResponse>("/api/billing/cancel", {
    method: "POST",
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function waitForPaymentResult(
  ref: string,
  options?: { attempts?: number; intervalMs?: number },
) {
  const attempts = options?.attempts ?? 30;
  const intervalMs = options?.intervalMs ?? 2000;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const transaction = await getPaymentTransaction(ref);

    if (transaction.status === "successful") {
      return transaction;
    }

    if (transaction.status === "failed") {
      throw new Error("Payment was declined or cancelled on your phone.");
    }

    await sleep(intervalMs);
  }

  throw new Error("Payment is still pending. Check your phone and try again.");
}
