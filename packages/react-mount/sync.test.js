import assert from "node:assert/strict";
import { test } from "node:test";
import { createMemoryRouter } from "react-router";
import { syncWithHost } from "./sync.js";

const routes = [{ path: "*", element: null }];
const memoryRouter = (path) => createMemoryRouter(routes, { initialEntries: [path] });

test("a navigation inside the remote is reported to the host once", async () => {
  const router = memoryRouter("/auth/signin");
  const reported = [];
  syncWithHost(router, (path) => reported.push(path));
  await router.navigate("/auth/signup");
  assert.deepEqual(reported, ["/auth/signup"]);
});

test("a host navigation moves the remote without echoing back", async () => {
  const router = memoryRouter("/");
  const reported = [];
  const { onHostNavigate } = syncWithHost(router, (path) => reported.push(path));
  onHostNavigate("/how-it-works");
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(router.state.location.pathname, "/how-it-works");
  assert.deepEqual(reported, []);
});

test("stop ends reporting", async () => {
  const router = memoryRouter("/");
  const reported = [];
  const { stop } = syncWithHost(router, (path) => reported.push(path));
  stop();
  await router.navigate("/elsewhere");
  assert.deepEqual(reported, []);
});
