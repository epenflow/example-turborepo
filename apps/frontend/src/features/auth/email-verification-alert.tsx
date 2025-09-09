import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle, Button } from "~/components/ui";
import { useAuthSession, useEmailVerificationSend } from "~/services/auth";

export function EmailVerificationAlert() {
  const { currentUser } = useAuthSession();
  const { mutateAsync } = useEmailVerificationSend();

  return (
    !currentUser?.isEmailVerified && (
      <div className="p-4">
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Email Not Verified</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Your account is not yet verified. Please check your inbox at **
              {currentUser?.email}** and click the verification link.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-accent-foreground"
              onClick={() => mutateAsync({ email: currentUser!.email })}>
              Resend Verification Email
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  );
}
