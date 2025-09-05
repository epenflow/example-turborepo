import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Heading } from "~/components/ui";
import { DeleteUser, UpdateUserForm } from "~/features/users";
import { usersQueries } from "~/services/users";
import type { UniqueIdentifier } from "~/shared/types";

export const Route = createFileRoute("/(dashboard)/users/$id")({
  params: {
    parse: (params) => ({ id: params.id as UniqueIdentifier }),
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(usersQueries.detail(params.id));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const {
    data: { user },
  } = useSuspenseQuery(usersQueries.detail(params.id));

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Heading
          title="User Detail"
          description={`Viewing details for ${user.fullName}`}
          variant="small"
        />
        <DeleteUser id={user.id} />
      </div>
      <UpdateUserForm user={user} />
    </div>
  );
}
