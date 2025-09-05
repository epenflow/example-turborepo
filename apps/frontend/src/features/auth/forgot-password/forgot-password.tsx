import { useState } from "react";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Heading,
} from "~/components/ui";
import * as AuthService from "~/services/auth";

export function ForgotPassword() {
  const { currentUser } = AuthService.useAuthSession();
  const { mutateAsync } = AuthService.useForgotPassword();
  const [open, setOpen] = useState<boolean>(false);

  if (!currentUser) return;

  const handleSendResetLink = () => {
    mutateAsync({ email: currentUser.email });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <Heading
        variant="small"
        title="Forgot Password"
        description="Receive a link to reset your password"
      />
      <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-200/10 dark:bg-blue-700/10">
        <div className="relative space-y-0.5 text-blue-600 dark:text-blue-100">
          <p className="font-medium">Reset Password</p>
          <p className="text-sm">
            Please click on "Send Reset Link" to receive the password reset
            link.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Forgot Password</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Receive a link to reset your password</DialogTitle>
            <DialogDescription>
              A password reset link will be sent to your registered email
              address. Please check your inbox.
            </DialogDescription>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSendResetLink}>Send Reset Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
