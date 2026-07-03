import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SubscribePaymentDialog } from "@/components/subscribe-payment-dialog";
import { Spinner } from "@/components/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatPrice } from "@/lib/billing";
import {
  cancelSubscriptionRemote,
  formatSubscriptionDate,
  getSubscription,
  subscribeToChanges,
  syncSubscriptionFromApi,
} from "@/lib/subscription-store";
import { useSubscriptionPlan } from "@/lib/use-subscription-plan";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  const [payOpen, setPayOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [, bump] = useState(0);
  const { plan, loading } = useSubscriptionPlan();

  useEffect(() => subscribeToChanges(() => bump((n) => n + 1)), []);

  useEffect(() => {
    syncSubscriptionFromApi().then(() => bump((n) => n + 1));
  }, []);

  const subscription = getSubscription();
  const isActive = subscription.status === "active";

  async function handleCancelPlan() {
    try {
      await cancelSubscriptionRemote();
      setCancelOpen(false);
      bump((n) => n + 1);
      toast.success("Subscription cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription");
    }
  }

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your tapme subscription plan.
        </p>
      </div>

      <section className="mx-auto max-w-xl rounded-2xl border border-border p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8" label="Loading plan" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Current plan</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  {plan.name}
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex h-8 items-center rounded-full px-3 text-xs font-bold",
                  isActive
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground",
                )}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-1 text-3xl font-bold text-foreground">
              {formatPrice(plan.price, plan.currency)}
              <span className="text-base font-normal text-muted-foreground"> / {plan.interval}</span>
            </div>

            {isActive && subscription.renewsAt ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Renews on {formatSubscriptionDate(subscription.renewsAt)}
              </p>
            ) : null}

            <ul className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  {feature}
                </li>
              ))}
            </ul>

            {!isActive ? (
              <button
                type="button"
                onClick={() => setPayOpen(true)}
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform hover:scale-[1.01]"
              >
                Subscribe
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Cancel plan
              </button>
            )}
          </>
        )}
      </section>

      <SubscribePaymentDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        onSuccess={() => bump((n) => n + 1)}
        plan={plan}
      />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your {plan.name} plan will be deactivated immediately. You can subscribe again at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep plan</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelPlan}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              Cancel plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
