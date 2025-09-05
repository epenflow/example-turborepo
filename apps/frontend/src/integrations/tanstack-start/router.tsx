import type { PropsWithChildren } from "react";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";

import * as DefaultRouter from "~/components/router";
import * as TanstackQuery from "~/integrations/tanstack-query";
import * as TuyauClient from "~/integrations/tuyau-client";
import { routeTree } from "~/routeTree.gen";

export interface RootRouteContext {
  queryClient: ReturnType<typeof TanstackQuery.createQueryClient>;
  tuyau: TuyauClient.Tuyau;
}

export function createRouter() {
  const queryClient = TanstackQuery.createQueryClient();

  const router = createTanstackRouter({
    routeTree,
    context: {
      queryClient: queryClient,
      tuyau: TuyauClient.tuyau,
    },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultViewTransition: true,
    defaultNotFoundComponent: DefaultRouter.NotFound,
    Wrap: (props: PropsWithChildren) => (
      <TanstackQuery.Provider queryClient={queryClient}>
        {props.children}
      </TanstackQuery.Provider>
    ),
  });

  TanstackQuery.setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
