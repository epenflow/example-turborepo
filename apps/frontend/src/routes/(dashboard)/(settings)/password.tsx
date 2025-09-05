import { createFileRoute } from "@tanstack/react-router";

import { Heading } from "~/components/ui";
import { ChangePasswordForm, ForgotPassword } from "~/features/auth";

export const Route = createFileRoute("/(dashboard)/(settings)/password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <Heading
        title="Update password"
        description="Ensure your account is using a long, random password to stay secure"
        variant="small"
      />
      <ChangePasswordForm />
      <ForgotPassword />
    </div>
  );
}
