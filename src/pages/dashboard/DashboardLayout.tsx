import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { DashboardGate } from "@/components/dashboard-gate";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { ProfileProvider } from "@/context/profile-context";
import { ThemeProvider } from "@/context/theme-context";

export function DashboardLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <DashboardGate>
          <DashboardPageShell>
            <Outlet />
          </DashboardPageShell>
          <Toaster />
        </DashboardGate>
      </ProfileProvider>
    </ThemeProvider>
  );
}
