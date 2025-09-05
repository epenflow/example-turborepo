import { useSession as useH3Session } from "@tanstack/react-start/server";

import type { AuthSession } from "./types";
import t3Env from "~/integrations/t3-env";

export function useSession() {
  return useH3Session<AuthSession>({
    name: "auth-session",
    password: t3Env.server.SESSION_PASSWORD,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    },
  });
}
