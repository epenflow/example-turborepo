import { createFileRoute } from "@tanstack/react-router";

import { Button } from "~/components/ui";
import { useEmailVerificationConfirm } from "~/services/auth";

export const Route = createFileRoute("/(auth)/(query)/email-verification")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = Route.useSearch();
  const { mutateAsync } = useEmailVerificationConfirm();
  return (
    <div>
      Hello "/(auth)/email-verification"!
      <p>{query.expiresAt}</p>
      <p>{query.token}</p>
      <Button onClick={() => mutateAsync(query.token)}>Confirm</Button>
    </div>
  );
}
