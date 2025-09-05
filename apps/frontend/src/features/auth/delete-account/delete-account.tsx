import { DeleteAccountForm } from "./delete-account-form";
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

export function DeleteAccount() {
  return (
    <div className="space-y-6">
      <Heading
        variant="small"
        title="Delete account"
        description="Delete your account and all of its resources"
      />
      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">Warning</p>
          <p className="text-sm">
            Please proceed with caution, this cannot be undone.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              Are you sure you want to delete your account?
            </DialogTitle>
            <DialogDescription>
              Once your account is deleted, all of its resources and data will
              also be permanently deleted. Please enter your password to confirm
              you would like to permanently delete your account.
            </DialogDescription>
            <DeleteAccountForm>
              {({ FormSubmitButton }) => (
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <FormSubmitButton variant="destructive" className="w-auto">
                    Delete account
                  </FormSubmitButton>
                </DialogFooter>
              )}
            </DeleteAccountForm>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
