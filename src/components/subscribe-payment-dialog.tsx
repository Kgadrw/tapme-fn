import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FinancialInstitutionLogo } from "@/components/financial-institution-select";
import { Spinner } from "@/components/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  initiateSubscriptionPayment,
  waitForPaymentResult,
} from "@/lib/billing-api";
import {
  BILLING_PROVIDERS,
  DEFAULT_SUBSCRIPTION_PLAN,
  formatPrice,
  type MobileMoneyProvider,
  type SubscriptionPlan,
} from "@/lib/billing";
import { syncSubscriptionFromApi } from "@/lib/subscription-store";
import { cn } from "@/lib/utils";

type SubscribePaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  plan?: SubscriptionPlan;
};

export function SubscribePaymentDialog({
  open,
  onOpenChange,
  onSuccess,
  plan = DEFAULT_SUBSCRIPTION_PLAN,
}: SubscribePaymentDialogProps) {
  const [provider, setProvider] = useState<MobileMoneyProvider | null>(null);
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setProvider(null);
      setPhone("");
      setPaying(false);
      setStatusMessage("");
    }
  }, [open]);

  async function handlePay(event: FormEvent) {
    event.preventDefault();
    if (!provider || !phone.trim()) return;

    setPaying(true);
    setStatusMessage("Sending payment request to your phone…");

    try {
      const payment = await initiateSubscriptionPayment({
        number: phone.trim(),
        provider,
      });

      setStatusMessage("Approve the payment on your phone…");
      await waitForPaymentResult(payment.ref);

      await syncSubscriptionFromApi();

      const selected = BILLING_PROVIDERS.find((item) => item.id === provider);
      toast.success(`${plan.name} is now active via ${selected?.label}.`);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment failed";
      toast.error(message);
    } finally {
      setPaying(false);
      setStatusMessage("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="g-modal-overlay"
        className="g-modal w-[calc(100%-2rem)] max-w-[440px] sm:rounded-[12px]"
      >
        <div className="g-modal-body">
          <DialogHeader className="space-y-0 text-left sm:text-left">
            <DialogTitle className="g-modal-title">Subscribe to {plan.name}</DialogTitle>
            <DialogDescription className="g-modal-desc">
              Pay {formatPrice(plan.price, plan.currency)} with mobile money to activate your plan.
            </DialogDescription>
          </DialogHeader>

          <form className="mt-6 space-y-5" onSubmit={handlePay}>
            <div className="grid gap-2 sm:grid-cols-2">
              {BILLING_PROVIDERS.map((item) => {
                const selected = provider === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={paying}
                    onClick={() => setProvider(item.id)}
                    className={cn(
                      "rounded-[8px] border p-3 text-left transition-colors",
                      selected
                        ? "border-transparent bg-[var(--g-blue-soft,#e8f0fe)]"
                        : "border-[var(--g-border,#dadce0)] hover:bg-[var(--g-canvas,#f8f9fa)]",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[8px] bg-white">
                      <FinancialInstitutionLogo
                        providerId={item.id}
                        type="mobile_money"
                        className="h-8 w-8"
                      />
                    </div>
                    <div
                      className={cn(
                        "mt-2 text-sm font-medium",
                        selected
                          ? "text-[var(--g-blue-text,#1967d2)]"
                          : "text-[var(--g-text,#202124)]",
                      )}
                    >
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </div>

            <label className="block">
              <span className="g-modal-label">Mobile money number</span>
              <input
                type="tel"
                value={phone}
                disabled={paying}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="0788123456"
                className="g-modal-input"
              />
            </label>

            {statusMessage ? (
              <p className="text-xs text-[var(--g-muted,#5f6368)]">{statusMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={!provider || !phone.trim() || paying}
              className="g-modal-btn"
            >
              {paying ? <Spinner className="h-4 w-4" /> : null}
              {paying ? "Processing…" : `Pay ${formatPrice(plan.price, plan.currency)}`}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
