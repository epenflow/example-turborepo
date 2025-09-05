import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { UserCard } from "~/features/users";
import { usersQueries } from "~/services/users";

export const Route = createFileRoute("/(dashboard)/users/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(usersQueries.all);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(usersQueries.all);

  if (data.users.length === 0) {
    return <p>Not Found!!!</p>;
  }

  return (
    <div className="p-4 space-y-6">
      {data.users.map((user) => (
        <Link to="/users/$id" params={{ id: user.id }} key={user.id}>
          <UserCard user={user} />
        </Link>
      ))}
    </div>
  );
}
