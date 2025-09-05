import { createFileRoute, Link } from "@tanstack/react-router";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui";
import { AuthLayout, SignUpForm } from "~/features/auth";

export const Route = createFileRoute("/(auth)/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create a new account by filling out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <Link to="/sign-in" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </AuthLayout>
  );
}
