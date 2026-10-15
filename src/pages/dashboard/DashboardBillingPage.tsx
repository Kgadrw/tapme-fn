import {
  Check,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
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
import { BILLING_PROVIDERS, formatPrice } from "@/lib/billing";
import { getMarketingUrl } from "@/lib/domains";
import {
  cancelSubscriptionRemote,
  formatSubscriptionDate,
  getSubscription,
  subscribeToChanges,
  syncSubscriptionFromApi,
} from "@/lib/subscription-store";
import { useSubscriptionPlan } from "@/lib/use-subscription-plan";
import { cn } from "@/lib/utils";

export function DashboardBillingPage() {
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
  const providerLabel = BILLING_PROVIDERS.find((p) => p.id === subscription.provider)?.label;

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
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="g-page-title">Billing</h1>
        <p className="g-page-subtitle">
          See your plan, payment status, and renewals in one place.
        </p>
      </div>

      {loading ? (
        <div className="g-card flex justify-center py-16">
          <Spinner className="h-8 w-8" label="Loading billing" />
        </div>
      ) : (
        <>
          <section
            className={cn(
              "g-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6",
              isActive ? "border-[#ceead6] bg-[#e6f4ea]/20" : "border-[#fce8e6] bg-[#fce8e6]/30",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  isActive ? "bg-[#e6f4ea] text-[#137333]" : "bg-[#fce8e6] text-[var(--g-danger)]",
                )}
              >
                {isActive ? (
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <Sparkles className="h-5 w-5" strokeWidth={1.75} />
                )}
              </span>
              <div>
                <div className="text-base font-medium text-[var(--g-text)]">
                  {isActive ? "Your TapMe Pro plan is active" : "You do not have an active plan"}
                </div>
                <p className="mt-1 text-sm text-[var(--g-muted)]">
                  {isActive
                    ? subscription.renewsAt
                      ? `Next renewal on ${formatSubscriptionDate(subscription.renewsAt)}. Cancel anytime.`
                      : "Your subscription is active. Cancel anytime."
                    : "Subscribe with mobile money to unlock TapMe Pro, including the verified badge on your public profile."}
                </p>
              </div>
            </div>
            {!isActive ? (
              <button type="button" onClick={() => setPayOpen(true)} className="g-btn-primary shrink-0">
                Subscribe now
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="g-btn-secondary shrink-0"
              >
                Cancel plan
              </button>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="g-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.04em] text-[var(--g-muted)]">
                    Plan
                  </div>
                  <h2 className="mt-1 text-xl font-normal text-[var(--g-text)]">{plan.name}</h2>
                </div>
                <span
                  className={cn(
                    "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium",
                    isActive
                      ? "bg-[#e6f4ea] text-[#137333]"
                      : "bg-[#f1f3f4] text-[var(--g-muted)]",
                  )}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-normal text-[var(--g-text)]">
                  {formatPrice(plan.price, plan.currency)}
                </span>
                <span className="text-sm text-[var(--g-muted)]">/ {plan.interval}</span>
              </div>

              <p className="mt-2 text-sm text-[var(--g-muted)]">
                Billed monthly via MTN MoMo or Airtel Money. No card required.
              </p>

              <div className="mt-6 border-t border-[var(--g-border)] pt-5">
                <h3 className="text-sm font-medium text-[var(--g-text)]">What you get</h3>
                <ul className="mt-3 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-[var(--g-text)]"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--g-blue)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {!isActive ? (
                <button
                  type="button"
                  onClick={() => setPayOpen(true)}
                  className="g-btn-primary mt-6 w-full sm:w-auto"
                >
                  Subscribe with mobile money
                </button>
              ) : null}
            </section>

            <div className="space-y-6">
              <section className="g-card p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
                  <h2 className="text-sm font-medium text-[var(--g-text)]">Subscription details</h2>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <DetailRow label="Status" value={isActive ? "Active" : "Inactive"} />
                  <DetailRow label="Plan" value={plan.name} />
                  <DetailRow
                    label="Price"
                    value={`${formatPrice(plan.price, plan.currency)} / ${plan.interval}`}
                  />
                  {isActive ? (
                    <>
                      <DetailRow
                        label="Payment method"
                        value={providerLabel ?? "Mobile money"}
                      />
                      {subscription.phone ? (
                        <DetailRow label="Phone number" value={subscription.phone} />
                      ) : null}
                      {subscription.activatedAt ? (
                        <DetailRow
                          label="Started"
                          value={formatSubscriptionDate(subscription.activatedAt)}
                        />
                      ) : null}
                      {subscription.renewsAt ? (
                        <DetailRow
                          label="Renews"
                          value={formatSubscriptionDate(subscription.renewsAt)}
                        />
                      ) : null}
                    </>
                  ) : (
                    <DetailRow label="Payment method" value="Not set yet" />
                  )}
                </dl>
              </section>

              <section className="g-card p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
                  <h2 className="text-sm font-medium text-[var(--g-text)]">How payment works</h2>
                </div>
                <ol className="mt-4 space-y-3 text-sm text-[var(--g-muted)]">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--g-blue-soft)] text-xs font-medium text-[var(--g-blue-text)]">
                      1
                    </span>
                    <span>Choose MTN MoMo or Airtel Money and enter your number.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--g-blue-soft)] text-xs font-medium text-[var(--g-blue-text)]">
                      2
                    </span>
                    <span>Approve the payment prompt on your phone.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--g-blue-soft)] text-xs font-medium text-[var(--g-blue-text)]">
                      3
                    </span>
                    <span>Your plan activates right away once payment succeeds.</span>
                  </li>
                </ol>
              </section>
            </div>
          </div>

          <section className="g-card p-5 md:p-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
              <h2 className="text-sm font-medium text-[var(--g-text)]">Common questions</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <FaqItem
                question="What is the verified badge?"
                answer="Active subscribers get a blue verified badge next to their name on the public profile. It disappears if the plan is cancelled."
              />
              <FaqItem
                question="Can I cancel anytime?"
                answer="Yes. Cancel from this page and your plan stops immediately. The verified badge and Pro features are removed until you subscribe again."
              />
              <FaqItem
                question="Need help with billing?"
                answer={
                  <>
                    Reach the TapMe team from the{" "}
                    <a
                      href={getMarketingUrl("/contact")}
                      className="font-medium text-[var(--g-blue-text)] underline-offset-2 hover:underline"
                    >
                      contact page
                    </a>
                    .
                  </>
                }
              />
            </div>
          </section>
        </>
      )}

      <SubscribePaymentDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        onSuccess={() => bump((n) => n + 1)}
        plan={plan}
      />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent
          overlayClassName="g-modal-overlay"
          className="g-modal max-w-[440px] gap-0 p-0 sm:rounded-[12px]"
        >
          <div className="g-modal-body space-y-5">
            <AlertDialogHeader className="space-y-0 text-left sm:text-left">
              <AlertDialogTitle className="g-modal-title">Cancel subscription?</AlertDialogTitle>
              <AlertDialogDescription className="g-modal-desc">
                Your {plan.name} plan will be deactivated immediately. You can subscribe again at any
                time.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:space-x-0">
              <AlertDialogCancel className="g-modal-btn-secondary mt-0 h-9 border shadow-none">
                Keep plan
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelPlan}
                className="h-9 rounded-full bg-[var(--g-danger)] px-5 text-sm font-medium text-white hover:bg-[#b3261e]"
              >
                Cancel plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[var(--g-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--g-text)]">{value}</dd>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-[var(--g-text)]">{question}</div>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--g-muted)]">{answer}</p>
    </div>
  );
}
