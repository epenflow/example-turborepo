import { Outlet } from "@tanstack/react-router";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
