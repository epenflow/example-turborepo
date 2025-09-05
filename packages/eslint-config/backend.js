import { configApp } from "@adonisjs/eslint-config";
import turboConfig from "eslint-config-turbo/flat";

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [...configApp(), ...turboConfig];
