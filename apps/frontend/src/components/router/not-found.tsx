import { Link } from "@tanstack/react-router";

import { buttonVariants } from "../ui";

export function NotFound() {
  return (
    <main className="min-h-dvh w-full flex items-center bg-accent">
      <section className="max-w-sm mx-auto flex flex-col items-center gap-4 px-8 md:px-0">
        <div className="flex items-center justify-center flex-col">
          <h3 className="text-primary font-mono text-2xl font-medium">404</h3>
          <h1 className="text-4xl font-bold text-primary">Page not found</h1>
        </div>

        <h3 className="text-sm font-medium text-center text-primary">
          Sorry, we couldn't find the page you're looking for. Please check the
          URL or navigate back home.
        </h3>

        <div className="relative group flex w-full transition-colors ease-in-out items-center justify-center [--h:0.5px] [&_.separator]:w-full [&_.separator]:block [&_.separator]:h-(--h) [&_.separator]:bg-border [&_.separator]:group-hover:bg-black">
          <span className="separator" />
          <Link to="/" className={buttonVariants({ variant: "link" })}>
            Home
          </Link>
          <span className="separator" />
        </div>
      </section>
    </main>
  );
}
