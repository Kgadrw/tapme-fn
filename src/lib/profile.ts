import type { PaymentLink } from "@/lib/payment-links";
import { getProfileUrl as buildProfileUrl } from "@/lib/domains";

export type SocialLink = {
  id: string;
  platformId: string;
  label: string;
  url: string;
};

export type { PaymentLink };

export type LinksLayout = "list" | "grid" | "icons";

export type UserProfile = {
  slug: string;
  fullName: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  bio: string;
  coverPhotoUrl?: string;
  avatarUrl?: string;
  linksLayout: LinksLayout;
  socialLinks: SocialLink[];
  paymentLinks: PaymentLink[];
};

export const CURRENT_USER_SLUG = "john-carter";

export const profilesBySlug: Record<string, UserProfile> = {
  [CURRENT_USER_SLUG]: {
    slug: CURRENT_USER_SLUG,
    fullName: "John Carter",
    jobTitle: "Product Designer",
    company: "Acme Inc.",
    phone: "+1 555 123 4567",
    email: "john@acme.com",
    website: "https://acme.com",
    location: "San Francisco, CA",
    bio: "Designing thoughtful digital products. Open to collaborations and coffee chats.",
    linksLayout: "grid",
    socialLinks: [
      {
        id: "social-linkedin",
        platformId: "linkedin",
        label: "LinkedIn",
        url: "https://linkedin.com/in/johncarter",
      },
      {
        id: "social-instagram",
        platformId: "instagram",
        label: "Instagram",
        url: "https://instagram.com/johncarter",
      },
      {
        id: "social-x",
        platformId: "x",
        label: "X",
        url: "https://x.com/johncarter",
      },
      {
        id: "social-github",
        platformId: "github",
        label: "GitHub",
        url: "https://github.com/johncarter",
      },
    ],
    paymentLinks: [
      {
        id: "mtn-momo",
        type: "mobile_money",
        label: "MTN MoMo",
        value: "0788123456",
        providerId: "mtn-momo",
      },
      {
        id: "bk-account",
        type: "bank_account",
        label: "Bank of Kigali",
        value: "1234567890123",
        providerId: "bank-of-kigali",
      },
      {
        id: "paypal",
        type: "payment_url",
        label: "PayPal",
        value: "https://paypal.me/johncarter",
        providerId: "paypal",
      },
    ],
  },
};

export function isProfileReady(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return profile.fullName.trim().length > 0;
}

export function getProfileUrl(slug: string, _origin = ""): string {
  return buildProfileUrl(slug);
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function copyProfileLink(slug: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(getProfileUrl(slug));
    return true;
  } catch {
    return false;
  }
}

export const LINKS_LAYOUT_OPTIONS: { value: LinksLayout; label: string; description: string }[] = [
  { value: "list", label: "List", description: "Stacked contact rows with social links in two columns" },
  { value: "grid", label: "Grid", description: "Contact and social links in two-column cards" },
  { value: "icons", label: "Icons", description: "Compact contact pills with social links in two columns" },
];
