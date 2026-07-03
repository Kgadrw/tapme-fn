export type BusinessOffer = {
  headline: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  badgeText?: string;
  brandColor?: string;
  enabled: boolean;
};

export type BusinessAccount = {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  ownerUserId?: string;
  logoUrl?: string;
  offer: BusinessOffer;
  teamSizeGoal: number;
  status: "pending" | "active" | "suspended";
  createdAt: string;
  updatedAt: string;
};

export type BusinessTeamRequest = {
  id: string;
  businessId?: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  teamSize: number;
  message?: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
};

export type BusinessTeamMember = {
  id: string;
  businessId: string;
  profileSlug?: string;
  fullName: string;
  email?: string;
  jobTitle?: string;
  status: "invited" | "active" | "removed";
  createdAt: string;
  updatedAt: string;
};

export type BusinessDashboardData = {
  account: BusinessAccount | null;
  requests: BusinessTeamRequest[];
  team: BusinessTeamMember[];
};

export const BUSINESS_BENEFITS = [
  {
    title: "Team profiles at scale",
    description: "Give every employee a consistent, branded digital profile linked to your company.",
  },
  {
    title: "Centralized management",
    description: "Add, update, and remove team profiles from one business dashboard.",
  },
  {
    title: "Custom business offer",
    description: "Show a tailored offer or call-to-action on every team member's profile.",
  },
  {
    title: "NFC cards for teams",
    description: "Order branded NFC cards for your whole team with unified profile links.",
  },
] as const;
