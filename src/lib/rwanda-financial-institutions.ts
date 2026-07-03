export type FinancialInstitutionCategory = "bank" | "mobile_money" | "payment";

export type FinancialInstitution = {
  id: string;
  name: string;
  logo: string;
  category: FinancialInstitutionCategory;
  /** Used for mobile money USSD dialing */
  ussdProvider?: "mtn" | "airtel";
};

/** Maps public/ image filenames to Rwanda banks, mobile money, and payment providers */
export const RWANDA_FINANCIAL_INSTITUTIONS: FinancialInstitution[] = [
  // Mobile money
  {
    id: "mtn-momo",
    name: "MTN MoMo",
    logo: "/momo.webp",
    category: "mobile_money",
    ussdProvider: "mtn",
  },
  {
    id: "airtel-money",
    name: "Airtel Money",
    logo: "/airtel.webp",
    category: "mobile_money",
    ussdProvider: "airtel",
  },

  // Commercial banks
  {
    id: "bank-of-kigali",
    name: "Bank of Kigali",
    logo: "/bk.png",
    category: "bank",
  },
  {
    id: "bpr-bank",
    name: "BPR Bank Rwanda",
    logo: "/bpr.png",
    category: "bank",
  },
  {
    id: "equity-bank",
    name: "Equity Bank Rwanda",
    logo: "/equity.png",
    category: "bank",
  },
  {
    id: "bank-of-africa",
    name: "Bank of Africa Rwanda",
    logo: "/bankafrica.png",
    category: "bank",
  },
  {
    id: "ecobank",
    name: "Ecobank Rwanda",
    logo: "/ecobank.avif",
    category: "bank",
  },
  {
    id: "access-bank",
    name: "Access Bank Rwanda",
    logo: "/accessbank.png",
    category: "bank",
  },
  {
    id: "gt-bank",
    name: "GTBank Rwanda",
    logo: "/gt bank.webp",
    category: "bank",
  },
  {
    id: "ncba-bank",
    name: "NCBA Bank Rwanda",
    logo: "/ncba.png",
    category: "bank",
  },
  {
    id: "unguka-bank",
    name: "Unguka Bank",
    logo: "/unguka.png",
    category: "bank",
  },
  {
    id: "urwego-bank",
    name: "Urwego Bank",
    logo: "/urwego.png",
    category: "bank",
  },
  {
    id: "banque-atlantique",
    name: "Banque Atlantique Rwanda",
    logo: "/atlantiqe.jpg",
    category: "bank",
  },
  {
    id: "ab-bank",
    name: "AB Bank Rwanda",
    logo: "/ab.jpg",
    category: "bank",
  },
  {
    id: "development-bank-rwanda",
    name: "Development Bank of Rwanda",
    logo: "/brd.jpg",
    category: "bank",
  },
  {
    id: "national-bank-rwanda",
    name: "National Bank of Rwanda",
    logo: "/bnr.jpg",
    category: "bank",
  },

  // Microfinance, SACCOs & digital payment
  {
    id: "letshego",
    name: "Letshego Rwanda",
    logo: "/letshego.jpg",
    category: "bank",
  },
  {
    id: "vision-finance",
    name: "Vision Finance",
    logo: "/vision.jpg",
    category: "bank",
  },
  {
    id: "umutanguha-finance",
    name: "Umutanguha Finance",
    logo: "/umutanguha.png",
    category: "bank",
  },
  {
    id: "inkunga-finance",
    name: "Inkunga Finance",
    logo: "/inkunga.png",
    category: "bank",
  },
  {
    id: "goshen-finance",
    name: "Goshen Finance",
    logo: "/goshen.jpg",
    category: "bank",
  },
  {
    id: "duterimbere-imf",
    name: "Duterimbere IMF",
    logo: "/duterimbere.png",
    category: "bank",
  },
  {
    id: "asa-microfinance",
    name: "ASA Microfinance Rwanda",
    logo: "/asa.png",
    category: "bank",
  },
  {
    id: "rim-ltd",
    name: "RIM Ltd",
    logo: "/rim.png",
    category: "bank",
  },
  {
    id: "sager-mfi",
    name: "Sager MFI",
    logo: "/sager.jpg",
    category: "bank",
  },
  {
    id: "cpf-rwanda",
    name: "CPF Rwanda",
    logo: "/cpf.webp",
    category: "bank",
  },
  {
    id: "fsa-rwanda",
    name: "FSA Rwanda",
    logo: "/fsa.jpg",
    category: "bank",
  },
  {
    id: "copedu-sacco",
    name: "Copedu SACCO",
    logo: "/copedu.png",
    category: "bank",
  },
  {
    id: "muganga-sacco",
    name: "Muganga SACCO",
    logo: "/muganga.webp",
    category: "bank",
  },
  {
    id: "umwalimu-sacco",
    name: "Umwalimu SACCO",
    logo: "/umwalimu.jpg",
    category: "bank",
  },

  // Payment pages & wallets
  {
    id: "paypal",
    name: "PayPal",
    logo: "/paypal.svg",
    category: "payment",
  },
  {
    id: "foundme",
    name: "FoundMe",
    logo: "/foundme.png",
    category: "payment",
  },
];

const institutionsById = new Map(
  RWANDA_FINANCIAL_INSTITUTIONS.map((institution) => [institution.id, institution]),
);

const filenameToId: Record<string, string> = {
  momo: "mtn-momo",
  airtel: "airtel-money",
  bk: "bank-of-kigali",
  bpr: "bpr-bank",
  equity: "equity-bank",
  bankafrica: "bank-of-africa",
  ecobank: "ecobank",
  accessbank: "access-bank",
  "gt bank": "gt-bank",
  ncba: "ncba-bank",
  unguka: "unguka-bank",
  urwego: "urwego-bank",
  atlantiqe: "banque-atlantique",
  ab: "ab-bank",
  brd: "development-bank-rwanda",
  bnr: "national-bank-rwanda",
  letshego: "letshego",
  vision: "vision-finance",
  umutanguha: "umutanguha-finance",
  inkunga: "inkunga-finance",
  goshen: "goshen-finance",
  duterimbere: "duterimbere-imf",
  asa: "asa-microfinance",
  rim: "rim-ltd",
  sager: "sager-mfi",
  cpf: "cpf-rwanda",
  fsa: "fsa-rwanda",
  copedu: "copedu-sacco",
  muganga: "muganga-sacco",
  umwalimu: "umwalimu-sacco",
  paypal: "paypal",
  foundme: "foundme",
};

export function encodeLogoPath(path: string) {
  const filename = path.replace(/^\//, "");
  return `/${encodeURIComponent(filename)}`;
}

export function institutionIdFromFilename(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "").toLowerCase().trim();
  return filenameToId[base] ?? null;
}

export function getFinancialInstitution(id?: string) {
  if (!id) return undefined;
  return institutionsById.get(id);
}

export function getInstitutionsByCategory(category: FinancialInstitutionCategory) {
  return RWANDA_FINANCIAL_INSTITUTIONS.filter((institution) => institution.category === category);
}

export function getDefaultInstitutionId(category: FinancialInstitutionCategory) {
  return getInstitutionsByCategory(category)[0]?.id ?? "";
}

export function resolvePaymentLinkInstitution(link: {
  type: string;
  providerId?: string;
  provider?: string;
}) {
  if (link.providerId) {
    return getFinancialInstitution(link.providerId);
  }

  if (link.type === "mobile_money" && link.provider) {
    if (link.provider === "mtn") return getFinancialInstitution("mtn-momo");
    if (link.provider === "airtel") return getFinancialInstitution("airtel-money");
  }

  if (link.type === "bank_account" && link.provider) {
    const normalized = link.provider.toLowerCase();
    return RWANDA_FINANCIAL_INSTITUTIONS.find(
      (institution) =>
        institution.category === "bank" &&
        (institution.name.toLowerCase() === normalized ||
          institution.name.toLowerCase().includes(normalized) ||
          normalized.includes(institution.name.toLowerCase())),
    );
  }

  return undefined;
}
