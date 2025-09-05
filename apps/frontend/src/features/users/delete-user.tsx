import { DialogClose } from "@radix-ui/react-dialog";
import { Trash } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui";
import { useDeleteUser } from "~/services/users/hooks";
import type { UniqueIdentifier } from "~/shared/types";

export function DeleteUser({ id }: { id: UniqueIdentifier }) {
  const { mutateAsync, isPending } = useDeleteUser(id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash />
          <span className="sr-only">Delete user</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <DialogDescription>
          Once you delete this user, all of its resources and data will also be
          permanently deleted. Please click continue button to continue this
          action
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => mutateAsync()}
            disabled={isPending}>
            Delete user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
