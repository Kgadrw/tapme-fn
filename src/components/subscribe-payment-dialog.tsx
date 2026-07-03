import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FinancialInstitutionLogo } from "@/components/financial-institution-select";
import { Spinner } from "@/components/spinner";
import {
  Dialog,
  DialogContent,
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
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name}</DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handlePay}>
          <div className="grid gap-3 sm:grid-cols-2">
            {BILLING_PROVIDERS.map((item) => {
              const selected = provider === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={paying}
                  onClick={() => setProvider(item.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-colors",
                    selected
                      ? "border-foreground bg-secondary"
                      : "border-border hover:bg-secondary/60",
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-background">
                    <FinancialInstitutionLogo
                      providerId={item.id}
                      type="mobile_money"
                      className="h-10 w-10"
                    />
                  </div>
                  <div className="mt-3 text-sm font-bold text-foreground">{item.label}</div>
                </button>
              );
            })}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs text-muted-foreground">Mobile money number</span>
            <input
              type="tel"
              value={phone}
              disabled={paying}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="0788123456"
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          {statusMessage ? (
            <p className="text-xs text-muted-foreground">{statusMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={!provider || !phone.trim() || paying}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paying ? <Spinner className="h-4 w-4" /> : null}
            {paying ? "Processing…" : `Pay ${formatPrice(plan.price, plan.currency)}`}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
