import { createFileRoute } from "@tanstack/react-router";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui";
import { AuthLayout, ResetPasswordForm } from "~/features/auth";

export const Route = createFileRoute("/(auth)/(query)/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = Route.useSearch();

  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={query.token} />
      </CardContent>
    </AuthLayout>
  );
}
