export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
};

export const DEFAULT_SUBSCRIPTION_PLAN: SubscriptionPlan = {
  id: "tapme-pro",
  name: "tapme Pro",
  price: 10000,
  currency: "RWF",
  interval: "month",
  features: [
    "Custom digital profile & NFC card link",
    "Unlimited social & payment links",
    "Profile analytics & insights",
    "QR code for your profile",
    "Priority support",
  ],
};

/** @deprecated Use useSubscriptionPlan() or fetchSubscriptionPlan() instead */
export const SUBSCRIPTION_PLAN = DEFAULT_SUBSCRIPTION_PLAN;

export type MobileMoneyProvider = "mtn-momo" | "airtel-money";

export const BILLING_PROVIDERS: {
  id: MobileMoneyProvider;
  label: string;
}[] = [
  {
    id: "mtn-momo",
    label: "MTN MoMo",
  },
  {
    id: "airtel-money",
    label: "Airtel Money",
  },
];

export function formatPrice(amount: number, currency: string) {
  return `${amount.toLocaleString()} ${currency}`;
}
