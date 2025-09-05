import { createFileRoute } from "@tanstack/react-router";

import { Heading } from "~/components/ui";
import { DeleteAccount, UpdateAccountForm } from "~/features/auth";

export const Route = createFileRoute("/(dashboard)/(settings)/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <Heading
        title="Account information"
        description="Update your account information"
        variant="small"
      />
      <UpdateAccountForm />
      <DeleteAccount />
    </div>
  );
}
