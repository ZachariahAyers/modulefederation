import { createApp } from "vue";
import DashboardPage from "./components/DashboardPage.vue";

export function mount(element) {
  const app = createApp(DashboardPage);
  app.mount(element);
  return { unmount: () => app.unmount() };
}
