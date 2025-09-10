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

    const expiresIn = DateTime.fromISO(search.expiresAt, { zone: "utc" });
    const now = DateTime.now().setZone("utc");

    if (
      !search.expiresAt ||
      !search.token ||
      !expiresIn.isValid ||
      expiresIn < now
    ) {
      throw notFound({
        throw: true,
      });
    }
  },
  component: Outlet,
});
