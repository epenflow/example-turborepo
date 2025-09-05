import { createFileRoute, redirect } from "@tanstack/react-router";

import { DashboardLayout } from "~/features/dashboard";

export const Route = createFileRoute("/(dashboard)")({
  beforeLoad: ({ context }) => {
    if (context.authSession.status === "UNAUTHENTICATED") {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: DashboardLayout,
});
