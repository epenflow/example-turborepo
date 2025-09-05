import { createFileRoute, notFound } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { DateTime } from "luxon";
import * as z from "zod";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui";
import { AuthLayout, ResetPasswordForm } from "~/features/auth";

const qsSchema = z.object({
  token: fallback(z.string(), "").default(""),
  expiresAt: fallback(z.string(), "").default(""),
});
export const Route = createFileRoute("/(auth)/reset-password")({
  validateSearch: zodValidator(qsSchema),
  loaderDeps: (deps) => deps,
  loader({ deps: { search } }) {
    if (
      !search.expiresAt ||
      !search.token ||
      !DateTime.fromISO(search.expiresAt).isValid ||
      DateTime.fromISO(search.expiresAt, { zone: "utc" }) <
        DateTime.now().toUTC()
    ) {
      // throw new Error(
      //   "The password reset token provided is invalid or expired.",
      // );
      throw notFound({
        throw: true,
      });
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  const qs = Route.useSearch();

  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={qs.token} />
      </CardContent>
    </AuthLayout>
  );
}
