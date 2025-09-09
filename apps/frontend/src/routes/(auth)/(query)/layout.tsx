import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { DateTime } from "luxon";
import z from "zod";

const querySchema = z.object({
  token: fallback(z.string(), "").default(""),
  expiresAt: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/(auth)/(query)")({
  validateSearch: zodValidator(querySchema),
  loaderDeps: (deps) => deps,
  loader({ deps: { search } }) {
    console.log({ search });
    if (
      !search.expiresAt ||
      !search.token ||
      !DateTime.fromISO(search.expiresAt).isValid ||
      DateTime.fromISO(search.expiresAt, { zone: "utc" }) <
        DateTime.now().toUTC()
    ) {
      // throw new Error(
      //   "The password reset token provided is invalid or expired.",
      // );
      throw notFound({
        throw: true,
      });
    }
  },
  component: Outlet,
});
