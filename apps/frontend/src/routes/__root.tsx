import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

import { Toaster } from "~/components/ui";
import globalsCss from "~/globals.css?url";
import * as TanstackStart from "~/integrations/tanstack-start";
import * as AuthService from "~/services/auth";

export const Route =
  createRootRouteWithContext<TanstackStart.RootRouteContext>()({
    beforeLoad: async ({ context }) => {
      if (typeof window === "undefined") {
        const data = await AuthService.authGetSessionFn();

        return {
          authSession: data,
        };
      } else {
        const data = await context.queryClient.ensureQueryData(
          AuthService.authQueries.session,
        );

        return {
          authSession: data,
        };
      }
    },
    loader: async ({ context }) => {
      if (context.authSession.status === "AUTHENTICATED") {
        const { currentUser } = await context.queryClient.ensureQueryData(
          AuthService.authQueries.me,
        );

        await AuthService.authUpdateSessionFn({
          data: { currentUser },
        });
      }
    },
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "TanStack Start Starter" },
      ],
      links: [
        {
          rel: "preconnect",
          href: "https://fonts.bunny.net",
        },
        {
          href: "https://fonts.bunny.net/css?family=instrument-sans:400,500,600",
          rel: "stylesheet",
        },
        { rel: "stylesheet", href: globalsCss },
      ],
    }),
    shellComponent: RootLayout,
  });

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-center" />
          <TanstackStart.Devtools />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
