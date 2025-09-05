import pluginJs from "@eslint/js";
import pluginTSR from "@tanstack/eslint-plugin-router";
import turboConfig from "eslint-config-turbo/flat";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import pluginTs from "typescript-eslint";

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  ...turboConfig,
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
      "@tanstack/router": pluginTSR,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginReactRefresh.configs.recommended.rules,
      "@tanstack/router/create-route-property-order": "error",
    },
  },
  globalIgnores([
    "dist",
    "dist-ssr",
    ".nitro",
    ".tanstack",
    ".output",
    ".vinxi",
    ".vscode",
  ]),
];
