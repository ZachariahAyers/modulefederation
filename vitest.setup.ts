import "@testing-library/jest-dom/vitest";
import { cleanup as cleanupReact } from "@testing-library/react";
import { cleanup as cleanupVue } from "@testing-library/vue";
import { afterEach } from "vitest";

// Testing Library only cleans up on its own when test globals are enabled.
afterEach(() => {
  cleanupReact();
  cleanupVue();
});
