// Starts every app's dev server side by side; Ctrl+C stops them all.
const { spawn } = require("node:child_process");

const apps = ["marketing", "auth", "dashboard", "container"];

for (const app of apps) {
  spawn("npm", ["start", "--workspace", app], { stdio: "inherit" });
}
