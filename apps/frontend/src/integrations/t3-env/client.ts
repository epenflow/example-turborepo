import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const client = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_BASE_URL: z.url(),
    VITE_JWT_SECRET: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
