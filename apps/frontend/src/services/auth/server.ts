import { createServerFn } from "@tanstack/react-start";

import { useSession } from "./session";
import type { AuthSession, AuthSessionContext } from "./types";

export const authUpdateSessionFn = createServerFn({ method: "POST" })
  .validator((data: Partial<AuthSession>) => data)
  .handler(async ({ data }) => {
    try {
      const { update } = await useSession();
      await update(data);
      return {
        success: true,
      };
    } catch (error) {
      console.warn("[authUpdateSessionFn] - ", error);
      return {
        success: true,
      };
    }
  });

export const authRevokeSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const { clear } = await useSession();
      await clear();
      return {
        success: true,
      };
    } catch (error) {
      console.warn("[authRevokeSessionFn] - ", error);
      return {
        success: false,
      };
    }
  },
);

export const authGetSessionFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthSessionContext> => {
    try {
      const { data } = await useSession();
      if (!data.accessToken && !data.currentUser) {
        return {
          status: "UNAUTHENTICATED",
        };
      }
      return {
        ...data,
        status: "AUTHENTICATED",
      };
    } catch (error) {
      console.warn("[authGetSessionFn] - ", error);
      return {
        status: "UNAUTHENTICATED",
      };
    }
  },
);

export type AuthUpdateSessionFn = typeof authUpdateSessionFn;
export type AuthRevokeSessionFn = typeof authRevokeSessionFn;
export type AuthGetSessionFn = typeof authGetSessionFn;
