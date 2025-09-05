import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
      tsr: {
        routeToken: "layout",
        indexToken: "page",
        target: "react",
      },
      client: {
        entry: "./integrations/tanstack-start/client.tsx",
      },
      server: {
        entry: "./integrations/tanstack-start/server.ts",
      },
    }),
    viteReact(),
  ],
});
