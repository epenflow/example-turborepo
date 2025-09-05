import { createFileRoute } from "@tanstack/react-router";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui";
import { AuthLayout, ForgotPasswordForm } from "~/features/auth";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </AuthLayout>
  );
}
