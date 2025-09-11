import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import {
  Button,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui";
import { useEmailVerificationConfirm } from "~/services/auth";

export const Route = createFileRoute("/(auth)/(query)/email-verification")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = Route.useSearch();

  const { mutateAsync, isPending, isSuccess, isError, error } =
    useEmailVerificationConfirm();

  const CardContent = () => {
    if (!query.token) {
      return (
        <CardHeader>
          <CardTitle>Invalid Link</CardTitle>
          <CardDescription>
            The verification link is missing a token. Please ensure you've
            clicked the full link provided in the email.
          </CardDescription>
        </CardHeader>
      );
    }

    if (isPending) {
      return (
        <CardHeader>
          <CardTitle>Verifying Your Email</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Please wait while we confirm your email address.
          </CardDescription>
        </CardHeader>
      );
    }

    if (isSuccess) {
      return (
        <CardHeader>
          <CardTitle>Verification Successful! 🎉</CardTitle>
          <CardDescription>
            Your email has been successfully verified. You can now close this
            page and log in.
          </CardDescription>
        </CardHeader>
      );
    }

    if (isError) {
      return (
        <>
          <CardHeader>
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>
              {error?.message ||
                "There was an error verifying your email. The link may have expired or been used already."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => mutateAsync(query.token)}>Retry</Button>
          </CardFooter>
        </>
      );
    }

    return (
      <>
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Click the button below to confirm your email address.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => mutateAsync(query.token)} disabled={isPending}>
            {isPending ? "Verifying..." : "Confirm Email"}
          </Button>
        </CardFooter>
      </>
    );
  };

  return <CardContent />;
}
