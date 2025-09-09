import { createFileRoute } from "@tanstack/react-router";
import { DateTime } from "luxon";

import { Heading } from "~/components/ui";
import { ChangePasswordForm, ForgotPassword } from "~/features/auth";
import { useAuthSession } from "~/services/auth";

export const Route = createFileRoute("/(dashboard)/(settings)/password")({
  component: RouteComponent,
});

function RouteComponent() {
  const { currentUser } = useAuthSession();

  return (
    <div className="space-y-6">
      <Heading
        title="Update password"
        description={
          <div className="text-sm text-muted-foreground">
            <p>
              Ensure your account is using a long, random password to stay
              secure
            </p>
            {currentUser?.lastPasswordChangedAt && (
              <p>
                Last password changed at: **
                {DateTime.fromISO(
                  currentUser.lastPasswordChangedAt,
                ).toLocaleString(DateTime.DATETIME_FULL)}
                **
              </p>
            )}
          </div>
        }
        variant="small"
      />

      <ChangePasswordForm />
      <ForgotPassword />
    </div>
  );
}
