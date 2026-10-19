// Starts every app's dev server side by side; Ctrl+C stops them all.
import { spawn } from "node:child_process";

for (const app of ["marketing", "auth", "dashboard", "container"]) {
  spawn("npm", ["start", "--workspace", app], { stdio: "inherit" });
}
