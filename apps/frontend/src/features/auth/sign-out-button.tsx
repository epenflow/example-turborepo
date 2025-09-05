import { type ComponentProps } from "react";
import { LogOut } from "lucide-react";

import { useSignOut } from "~/services/auth";

export function SignOutButton({
  asIcon,
  onClick,
  ...props
}: ComponentProps<"button"> & {
  asIcon?: boolean;
}) {
  const { mutateAsync, isPending } = useSignOut();

  return (
    <button
      onClick={(e) => {
        mutateAsync();
        onClick?.(e);
      }}
      disabled={isPending}
      {...props}>
      {asIcon ? (
        <>
          <LogOut />
        </>
      ) : (
        <>
          <LogOut />
          <span>Sign-Out</span>
        </>
      )}
      <span className="sr-only">Sign-Out</span>
    </button>
  );
}
