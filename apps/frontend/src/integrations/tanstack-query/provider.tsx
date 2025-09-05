import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// eslint-disable-next-line react-refresh/only-export-components
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
      },
    },
  });
}

type ProviderProps = {
  queryClient: QueryClient;
} & PropsWithChildren;
export function Provider(props: ProviderProps) {
  return (
    <QueryClientProvider client={props.queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
