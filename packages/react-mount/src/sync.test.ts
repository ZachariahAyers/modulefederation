import { createMemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { syncWithHost } from "./sync";

const memoryRouter = (path: string) =>
  createMemoryRouter([{ path: "*", element: null }], { initialEntries: [path] });

describe("syncWithHost", () => {
  it("reports a navigation inside the remote to the host once", async () => {
    const router = memoryRouter("/auth/signin");
    const reported: string[] = [];
    syncWithHost(router, (path) => reported.push(path));

    await router.navigate("/auth/signup");

    expect(reported).toEqual(["/auth/signup"]);
  });

  it("follows a host navigation without echoing it back", async () => {
    const router = memoryRouter("/");
    const reported: string[] = [];
    const { onHostNavigate } = syncWithHost(router, (path) => reported.push(path));

    onHostNavigate("/how-it-works");
    await vi.waitFor(() => expect(router.state.location.pathname).toBe("/how-it-works"));

    expect(reported).toEqual([]);
  });

  it("does nothing when the host is already on the remote's path", () => {
    const router = memoryRouter("/");
    const navigate = vi.spyOn(router, "navigate");
    const { onHostNavigate } = syncWithHost(router, () => {});

    onHostNavigate("/");

    expect(navigate).not.toHaveBeenCalled();
  });

  it("stops reporting once stopped", async () => {
    const router = memoryRouter("/");
    const reported: string[] = [];
    const { stop } = syncWithHost(router, (path) => reported.push(path));

    stop();
    await router.navigate("/elsewhere");

    expect(reported).toEqual([]);
  });
});
