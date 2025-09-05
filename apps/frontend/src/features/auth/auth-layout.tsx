import type { PropsWithChildren } from "react";

import { Card } from "~/components/ui";

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-dvh h-full w-full items-center justify-center px-4">
      <Card asChild className="mx-auto max-w-sm w-full">
        <section>{children}</section>
      </Card>
    </main>
  );
}
