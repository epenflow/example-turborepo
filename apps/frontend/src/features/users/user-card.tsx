import type { UserDto } from "@repo/backend/dtos";

import { Card, CardContent } from "~/components/ui";

export function UserCard({ user }: { user: UserDto }) {
  return (
    <Card>
      <CardContent>
        {user.firstName && <p>{user.firstName}</p>}
        {user.lastName && <p>{user.lastName}</p>}
        {user.fullName}
        <p>{user.username}</p>
        <p>{user.email}</p>
        {user.dob && <p>{user.dob}</p>}
        <p>{user.createdAt}</p>
        <p>{user.updatedAt}</p>
      </CardContent>
    </Card>
  );
}
