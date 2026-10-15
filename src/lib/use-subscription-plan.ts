import { useEffect, useState } from "react";

import { DEFAULT_SUBSCRIPTION_PLAN, type SubscriptionPlan } from "@/lib/billing";
import { loadSubscriptionPlan } from "@/lib/billing-api";

export function useSubscriptionPlan() {
  const [plan, setPlan] = useState<SubscriptionPlan>(DEFAULT_SUBSCRIPTION_PLAN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadSubscriptionPlan()
      .then((loaded) => {
        if (active) setPlan(loaded);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { plan, loading };
}
