import { Outlet } from "@tanstack/react-router";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui";
import { EmailVerificationAlert } from "~/features/auth";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <EmailVerificationAlert />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
