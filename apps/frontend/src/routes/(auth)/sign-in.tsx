import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui";
import { AuthLayout, SignInForm } from "~/features/auth";

export const Route = createFileRoute("/(auth)/sign-in")({
  beforeLoad: ({ context }) => {
    if (context.authSession.status === "AUTHENTICATED") {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <Link to="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </AuthLayout>
  );
}
