// Every remote the host knows about. The import specifiers resolve through
// Module Federation to each app's remoteEntry.js at runtime.
export const remotes = {
  marketing: {
    name: "marketing",
    label: "Marketing",
    framework: "React",
    load: () => import("marketing/mount"),
  },
  auth: {
    name: "auth",
    label: "Auth",
    framework: "React",
    load: () => import("auth/mount"),
  },
  dashboard: {
    name: "dashboard",
    label: "Dashboard",
    framework: "Vue",
    load: () => import("dashboard/mount"),
  },
};
