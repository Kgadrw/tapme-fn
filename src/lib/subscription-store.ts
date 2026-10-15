import { DEFAULT_SUBSCRIPTION_PLAN, type MobileMoneyProvider } from "@/lib/billing";
import {
  cancelSubscriptionApi,
  getSubscriptionStatus,
  type SubscriptionStatusResponse,
} from "@/lib/billing-api";
import { isAuthenticated } from "@/lib/auth-store";

const STORAGE_KEY = "tapme-subscription";

export type SubscriptionStatus = "inactive" | "active";

export type Subscription = {
  status: SubscriptionStatus;
  planId: string;
  provider?: MobileMoneyProvider;
  phone?: string;
  activatedAt?: string;
  renewsAt?: string;
};

const defaultSubscription: Subscription = {
  status: "inactive",
  planId: DEFAULT_SUBSCRIPTION_PLAN.id,
};

let subscription = loadSubscription();
const listeners = new Set<() => void>();

function loadSubscription(): Subscription {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSubscription, ...JSON.parse(stored) };
    }
  } catch {
    // ignore corrupt storage
  }
  return defaultSubscription;
}

function persist(next: Subscription) {
  subscription = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  listeners.forEach((listener) => listener());
}

export function getSubscription(): Subscription {
  return subscription;
}

export function subscribe(input: {
  provider: MobileMoneyProvider;
  phone: string;
  planId?: string;
}): Subscription {
  const activatedAt = new Date();
  const renewsAt = new Date(activatedAt);
  renewsAt.setMonth(renewsAt.getMonth() + 1);

  const next: Subscription = {
    status: "active",
    planId: input.planId ?? DEFAULT_SUBSCRIPTION_PLAN.id,
    provider: input.provider,
    phone: input.phone,
    activatedAt: activatedAt.toISOString(),
    renewsAt: renewsAt.toISOString(),
  };

  persist(next);
  return next;
}

export function cancelSubscription(): Subscription {
  const next: Subscription = {
    status: "inactive",
    planId: subscription.planId || DEFAULT_SUBSCRIPTION_PLAN.id,
  };

  persist(next);
  return next;
}

export function subscribeToChanges(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function formatSubscriptionDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function applySubscriptionStatus(data: SubscriptionStatusResponse): Subscription {
  if (data.status === "active") {
    const next: Subscription = {
      status: "active",
      planId: data.planId,
      provider: data.provider as MobileMoneyProvider | undefined,
      phone: data.phone,
      activatedAt: data.activatedAt,
      renewsAt: data.renewsAt,
    };
    persist(next);
    return next;
  }

  const next: Subscription = {
    status: "inactive",
    planId: data.planId,
  };
  persist(next);
  return next;
}

export async function syncSubscriptionFromApi() {
  if (!isAuthenticated()) return getSubscription();

  try {
    const data = await getSubscriptionStatus();
    return applySubscriptionStatus(data);
  } catch {
    return getSubscription();
  }
}

export async function cancelSubscriptionRemote() {
  const data = await cancelSubscriptionApi();
  return applySubscriptionStatus(data);
}
