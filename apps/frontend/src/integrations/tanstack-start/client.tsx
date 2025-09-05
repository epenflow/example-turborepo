import { startTransition } from "react";
import { StartClient } from "@tanstack/react-start";
import { hydrateRoot } from "react-dom/client";

import { createRouter } from "./router";

const router = createRouter();

startTransition(() => {
  hydrateRoot(document, <StartClient router={router} />);
});
