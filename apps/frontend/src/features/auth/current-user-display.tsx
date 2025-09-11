import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui";
import { useAvatarPreview } from "~/hooks";
import { useAuthSession } from "~/services/auth";

export function CurrentUserDisplay({
  showEmail = false,
  showUsername = false,
}: {
  showEmail?: boolean;
  showUsername?: boolean;
}) {
  const { currentUser } = useAuthSession();
  const [previewAvatar] = useAvatarPreview(currentUser?.avatar);

  if (!currentUser) return;

  return (
    <>
      <Avatar className="h-8 w-8 overflow-hidden rounded-full">
        {currentUser.avatar ? (
          <AvatarImage src={previewAvatar} />
        ) : (
          <AvatarFallback>{currentUser.initialName}</AvatarFallback>
        )}
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{currentUser.fullName}</span>
        {showUsername && (
          <span className="truncate text-xs text-muted-foreground">
            {currentUser.username}
          </span>
        )}
        {showEmail && (
          <span className="truncate text-xs text-muted-foreground">
            {currentUser.email}
          </span>
        )}
      </div>
    </>
  );
}
