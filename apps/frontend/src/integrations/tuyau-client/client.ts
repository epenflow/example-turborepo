/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../../../backend/.adonisjs/api.ts" />
import { createTuyau } from "@tuyau/client";

import { api } from "@repo/backend/api";
import type { AccessTokenDto } from "@repo/backend/dtos";

import t3Env from "../t3-env";
import { createQueryClient } from "../tanstack-query";
import * as AuthService from "~/services/auth";

export const tuyau = createTuyau({
  api,
  baseUrl: t3Env.client.VITE_APP_BASE_URL,
  hooks: {
    beforeRequest: [
      async (req) => {
        let accessToken: AccessTokenDto | undefined = undefined;

        if (typeof window === "undefined") {
          const data = await AuthService.authGetSessionFn();
          accessToken = data.accessToken;
        } else {
          const queryClient = createQueryClient();
          const data = await queryClient.ensureQueryData(
            AuthService.authQueries.session,
          );
          accessToken = data.accessToken;
        }

        if (accessToken) {
          req.headers.set("Authorization", `Bearer ${accessToken.token}`);
        }
      },
    ],
  },
});

export type Tuyau = typeof tuyau;
