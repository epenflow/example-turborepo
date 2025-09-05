import { queryOptions } from "@tanstack/react-query";

import { tuyau } from "~/integrations/tuyau-client";
import type { UniqueIdentifier } from "~/shared/types";

export const usersQueries = {
  all: queryOptions({
    queryKey: ["users", "all"],
    queryFn: () => tuyau.api.users.$get().unwrap(),
  }),
  detail: (id: UniqueIdentifier) =>
    queryOptions({
      queryKey: ["users", "detail", String(id)],
      queryFn: () => tuyau.api.users({ id }).$get().unwrap(),
    }),
};
