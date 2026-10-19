import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import vue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["**/dist/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  vue.configs["flat/recommended"],
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  { files: ["**/*.tsx"], extends: [reactHooks.configs.flat.recommended] },
  prettier,
]);
