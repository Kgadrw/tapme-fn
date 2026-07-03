import {
  getFinancialInstitution,
  resolvePaymentLinkInstitution,
} from "@/lib/rwanda-financial-institutions";

export type PaymentLinkType = "mobile_money" | "bank_account" | "payment_url";

export type PaymentLink = {
  id: string;
  type: PaymentLinkType;
  label: string;
  value: string;
  /** Institution id from rwanda-financial-institutions */
  providerId?: string;
  /** @deprecated Use providerId — kept for older saved links */
  provider?: string;
};

export const PAYMENT_LINK_TYPES: {
  value: PaymentLinkType;
  label: string;
  description: string;
}[] = [
  {
    value: "mobile_money",
    label: "Mobile money",
    description: "Dial USSD so visitors can send money to your number",
  },
  {
    value: "bank_account",
    label: "Bank account",
    description: "Let visitors copy your account number",
  },
  {
    value: "payment_url",
    label: "Payment link",
    description: "Open PayPal, Stripe, or any payment page",
  },
];

export function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function getUssdProvider(link: Pick<PaymentLink, "providerId" | "provider">) {
  const institution = resolvePaymentLinkInstitution({
    type: "mobile_money",
    providerId: link.providerId,
    provider: link.provider,
  });

  if (institution?.ussdProvider) {
    return institution.ussdProvider;
  }

  if (link.provider === "airtel") return "airtel";
  return "mtn";
}

/** Rwanda phone numbers are 10 digits (e.g. 0788123456). Anything else is treated as a merchant code. */
export function isMobileMoneyPhoneNumber(value: string) {
  return normalizeDigits(value).length === 10;
}

export function buildMobileMoneyUssd(
  phone: string,
  providerOrLink: string | Pick<PaymentLink, "providerId" | "provider"> = "mtn",
) {
  const digits = normalizeDigits(phone);
  const provider =
    typeof providerOrLink === "string"
      ? providerOrLink
      : getUssdProvider(providerOrLink);

  if (provider === "airtel") {
    return `*182*1*2*${digits}#`;
  }

  // MTN: 10-digit phone → send money; otherwise merchant code payment
  if (digits.length === 10) {
    return `*182*1*1*${digits}#`;
  }

  return `*182*8*1*${digits}#`;
}

export function getMobileMoneyDialHref(
  phone: string,
  providerOrLink?: string | Pick<PaymentLink, "providerId" | "provider">,
) {
  const ussd = buildMobileMoneyUssd(phone, providerOrLink ?? "mtn");
  return `tel:${encodeURIComponent(ussd)}`;
}

export function getPaymentUrlHref(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

export function getPaymentLinkActionLabel(type: PaymentLinkType, link?: PaymentLink) {
  switch (type) {
    case "mobile_money":
      if (link && getUssdProvider(link) === "mtn" && !isMobileMoneyPhoneNumber(link.value)) {
        return "Pay merchant";
      }
      return "Pay";
    case "bank_account":
      return "Copy account";
    case "payment_url":
      return "Open link";
  }
}

export function getPaymentLinkHint(type: PaymentLinkType, link: PaymentLink) {
  const institution = resolvePaymentLinkInstitution(link);

  switch (type) {
    case "mobile_money":
      return buildMobileMoneyUssd(link.value, link);
    case "bank_account":
      return institution ? `${institution.name} · ${link.value}` : link.provider ? `${link.provider} · ${link.value}` : link.value;
    case "payment_url":
      return link.value.replace(/^https?:\/\//, "");
  }
}

export function getPaymentLinkLogo(link: PaymentLink) {
  const institution =
    getFinancialInstitution(link.providerId) ?? resolvePaymentLinkInstitution(link);
  return institution?.logo;
}

export async function copyPaymentValue(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function createPaymentLinkId() {
  return `pay-${Date.now()}`;
}
