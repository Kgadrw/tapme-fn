import type { ReactNode } from "react";

import { Spinner } from "@/components/spinner";
import { useAuth } from "@/context/auth-context";
import { useProfileBootstrap } from "@/context/profile-context";

export function DashboardGate({ children }: { children: ReactNode }) {
  const { isBootstrapping } = useAuth();
  const { loading: profileLoading, profile } = useProfileBootstrap();

  if (isBootstrapping || profileLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" label="Loading your account" />
      </div>
    );
  }

  return children;
}
