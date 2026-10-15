import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { BusinessDashboardSidebar } from "@/components/business-dashboard-sidebar";
import { ThemeProvider } from "@/context/theme-context";

export function BusinessDashboardLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col md:flex-row">
          <BusinessDashboardSidebar />
          <main className="min-w-0 flex-1 md:ml-[17rem]">
            <div className="w-full px-6 py-10 md:px-10 md:py-14">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
