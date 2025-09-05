import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const server = createEnv({
  server: {
    SESSION_PASSWORD: z.string(),
    JWT_SECRET: z.string(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
