import { queryOptions } from "@tanstack/react-query";

import { authGetSessionFn } from "./server";
import { tuyau } from "~/integrations/tuyau-client";

export const authQueries = {
  session: queryOptions({
    queryKey: ["auth", "session"],
    queryFn: authGetSessionFn,
  }),
  me: queryOptions({
    queryKey: ["auth", "me"],
    queryFn: () => tuyau.auth.me.$get().unwrap(),
  }),
};
