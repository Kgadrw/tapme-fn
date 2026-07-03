import { Plus } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { FinancialInstitutionSelect } from "@/components/financial-institution-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  createPaymentLinkId,
  PAYMENT_LINK_TYPES,
  type PaymentLink,
  type PaymentLinkType,
} from "@/lib/payment-links";
import {
  getFinancialInstitution,
  getInstitutionsByCategory,
  resolvePaymentLinkInstitution,
  type FinancialInstitutionCategory,
} from "@/lib/rwanda-financial-institutions";

type PaymentLinkDialogProps = {
  link?: PaymentLink;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAdd?: (link: PaymentLink) => void;
  onUpdate?: (link: PaymentLink) => void;
  trigger?: ReactNode;
};

function categoryForType(type: PaymentLinkType): FinancialInstitutionCategory {
  switch (type) {
    case "mobile_money":
      return "mobile_money";
    case "bank_account":
      return "bank";
    case "payment_url":
      return "payment";
  }
}

const defaultForm = {
  type: null as PaymentLinkType | null,
  value: "",
  providerId: "",
};

function providerPlaceholder(type: PaymentLinkType | null) {
  switch (type) {
    case "mobile_money":
      return "Search MTN MoMo, Airtel Money…";
    case "bank_account":
      return "Search BK, Equity, BPR…";
    case "payment_url":
      return "Search PayPal, Stripe…";
    default:
      return "Pick a payment type above first";
  }
}

function linkToForm(link: PaymentLink) {
  const institution = resolvePaymentLinkInstitution(link);
  return {
    type: link.type,
    value: link.value,
    providerId: link.providerId ?? institution?.id ?? "",
  };
}

export function AddPaymentLinkDialog({
  link,
  open: controlledOpen,
  onOpenChange,
  onAdd,
  onUpdate,
  trigger,
}: PaymentLinkDialogProps) {
  const isEdit = Boolean(link);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(link ? linkToForm(link) : defaultForm);
    }
  }, [open, link]);

  const institutions = form.type ? getInstitutionsByCategory(categoryForType(form.type)) : [];
  const selectedInstitution = form.providerId ? getFinancialInstitution(form.providerId) : undefined;

  function resetForm() {
    setForm(defaultForm);
  }

  function handleTypeChange(type: PaymentLinkType) {
    setForm({
      type,
      value: "",
      providerId: "",
    });
  }

  function handleProviderChange(providerId: string) {
    setForm((current) => ({
      ...current,
      providerId,
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.type || !form.value.trim() || !form.providerId) return;

    const label = selectedInstitution?.name?.trim();
    if (!label) return;

    const nextLink: PaymentLink = {
      id: link?.id ?? createPaymentLinkId(),
      type: form.type,
      label,
      value: form.value.trim(),
      providerId: form.providerId,
    };

    if (isEdit && onUpdate) {
      onUpdate(nextLink);
    } else if (onAdd) {
      onAdd(nextLink);
    }

    resetForm();
    setOpen(false);
  }

  const canSubmit = Boolean(form.type && form.providerId && form.value.trim());

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      {trigger !== undefined ? (
        trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null
      ) : !isEdit ? (
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" /> Add link
          </button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit payment link" : "Add payment link"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_LINK_TYPES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTypeChange(option.value)}
                  className={`rounded-xl border px-3 py-2 text-left text-xs transition-colors ${
                    form.type === option.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={isEdit ? `payment-provider-${link?.id}` : "payment-provider"}>
              {form.type === "mobile_money"
                ? "Mobile money provider"
                : form.type === "bank_account"
                  ? "Bank"
                  : form.type === "payment_url"
                    ? "Payment provider"
                    : "Provider"}
            </Label>
            <FinancialInstitutionSelect
              id={isEdit ? `payment-provider-${link?.id}` : "payment-provider"}
              institutions={institutions}
              value={form.providerId}
              onValueChange={handleProviderChange}
              placeholder={providerPlaceholder(form.type)}
              disabled={!form.type}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={isEdit ? `payment-value-${link?.id}` : "payment-value"}>
              {form.type === "mobile_money"
                ? "Mobile money number"
                : form.type === "bank_account"
                  ? "Account number"
                  : form.type === "payment_url"
                    ? "Payment URL"
                    : "Account details"}
            </Label>
            <input
              id={isEdit ? `payment-value-${link?.id}` : "payment-value"}
              value={form.value}
              disabled={!form.type || !form.providerId}
              onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
              placeholder={
                !form.type
                  ? "Choose a payment type above first"
                  : !form.providerId
                    ? "Select a provider to continue"
                    : form.type === "mobile_money"
                      ? "0788123456"
                      : form.type === "bank_account"
                        ? "1234567890123"
                        : "https://paypal.me/you"
              }
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button type="submit" disabled={!canSubmit} className="h-11 w-full rounded-full">
            {isEdit ? "Save changes" : "Add payment link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
