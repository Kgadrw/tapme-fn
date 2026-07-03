import { Building2, Check, Link2, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";

import { FinancialInstitutionLogo } from "@/components/financial-institution-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  copyPaymentValue,
  getPaymentLinkLogo,
  getPaymentUrlHref,
  type PaymentLink,
} from "@/lib/payment-links";
import { encodeSocialLogoPath } from "@/lib/social-platforms";
import { cn } from "@/lib/utils";

const payIcon = "/icons/pay.svg";

const paymentIcons = {
  mobile_money: Smartphone,
  bank_account: Building2,
  payment_url: Link2,
} as const;

function PaymentLinkIcon({
  link,
  copied,
  compact,
}: {
  link: PaymentLink;
  copied: boolean;
  compact?: boolean;
}) {
  const logo = getPaymentLinkLogo(link);
  const Icon = paymentIcons[link.type] ?? Wallet;
  const isCopyType = link.type === "bank_account" || link.type === "mobile_money";

  if (copied && isCopyType) {
    return <Check className={compact ? "h-5 w-5" : "h-6 w-6"} />;
  }

  if (logo) {
    return (
      <FinancialInstitutionLogo
        providerId={link.providerId}
        provider={link.provider}
        type={link.type}
        className={compact ? "h-9 w-9" : "h-11 w-11"}
      />
    );
  }

  return <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />;
}

function PaymentLinkGridCard({
  link,
  compact,
  onLinkClick,
}: {
  link: PaymentLink;
  compact?: boolean;
  onLinkClick?: (label: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isCopyType = link.type === "bank_account" || link.type === "mobile_money";

  async function handleCopy() {
    const success = await copyPaymentValue(link.value);
    if (!success) return;
    onLinkClick?.(link.label);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const content = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-sm",
          compact ? "h-9 w-9" : "h-11 w-11",
        )}
      >
        <PaymentLinkIcon link={link} copied={copied} compact={compact} />
      </span>
      <span className={cn("font-medium text-foreground", compact ? "text-[11px]" : "text-xs")}>
        {link.label}
      </span>
    </>
  );

  const className = cn(
    "flex flex-col items-center justify-center rounded-2xl border border-border bg-background text-center transition-colors hover:bg-secondary",
    compact ? "gap-1 px-2 py-2.5" : "gap-1.5 px-3 py-3.5",
  );

  if (isCopyType) {
    return (
      <button type="button" onClick={handleCopy} className={className}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={getPaymentUrlHref(link.value)}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => onLinkClick?.(link.label)}
    >
      {content}
    </a>
  );
}

export function PaymentPayButton({
  paymentLinks,
  compact,
  className,
  onPaymentLinkClick,
}: {
  paymentLinks: PaymentLink[];
  compact?: boolean;
  className?: string;
  onPaymentLinkClick?: (label: string) => void;
}) {
  if (paymentLinks.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={className}>
          <img
            src={encodeSocialLogoPath(payIcon)}
            alt=""
            className={cn("rounded-[2px] object-contain", compact ? "h-4 w-4" : "h-5 w-5")}
          />
          Pay
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Choose how to pay</DialogTitle>
        </DialogHeader>
        <PaymentLinksGrid
          paymentLinks={paymentLinks}
          compact={compact}
          onLinkClick={onPaymentLinkClick}
        />
      </DialogContent>
    </Dialog>
  );
}

export function PaymentLinksGrid({
  paymentLinks,
  compact,
  onLinkClick,
}: {
  paymentLinks: PaymentLink[];
  compact?: boolean;
  onLinkClick?: (label: string) => void;
}) {
  if (paymentLinks.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-2", compact ? "gap-2" : "gap-2.5")}>
      {paymentLinks.map((link) => (
        <PaymentLinkGridCard key={link.id} link={link} compact={compact} onLinkClick={onLinkClick} />
      ))}
    </div>
  );
}
