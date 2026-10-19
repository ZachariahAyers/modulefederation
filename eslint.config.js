const js = require("@eslint/js");
const reactHooks = require("eslint-plugin-react-hooks");
const vue = require("eslint-plugin-vue");
const globals = require("globals");

module.exports = [
  { ignores: ["**/dist/"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["packages/*/src/**", "packages/react-mount/**"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["packages/*/src/**/*.{js,jsx,vue}", "packages/react-mount/**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ["packages/react-mount/**/*.test.js"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.jsx"],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ["packages/container/src/**"],
    languageOptions: { globals: { __FEDERATION__: "readonly" } },
  },
  ...vue.configs["flat/recommended"],
];
