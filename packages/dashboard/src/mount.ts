import type { Mount } from "@mfe/contract";
import { createApp } from "vue";
import DashboardPage from "./components/DashboardPage.vue";

// The dashboard has a single route, so it ignores the host's path and needs no router.
export const mount: Mount = (element) => {
  const app = createApp(DashboardPage);
  app.mount(element);
  return { unmount: () => app.unmount() };
};
