import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { loadRemote, useRemoteStatuses } from "./remote-status";
import type { Remote } from "./remotes";

// The status store is module state, so each test uses its own remote name.
function fakeRemote(name: string) {
  let settle!: { resolve: () => void; reject: (error: Error) => void };
  const load = vi.fn(
    () =>
      new Promise<{ mount: never }>((resolve, reject) => {
        settle = { resolve: () => resolve({ mount: undefined as never }), reject };
      }),
  );
  const remote: Remote = { name, label: name, framework: "React", load };
  return { remote, load, settle: () => settle };
}

describe("loadRemote", () => {
  it("reports loading, then loaded with the measured time", async () => {
    const { remote, settle } = fakeRemote("timed");
    const { result } = renderHook(() => useRemoteStatuses());

    let loading!: Promise<unknown>;
    act(() => {
      loading = loadRemote(remote);
    });
    expect(result.current.timed).toEqual({ state: "loading" });

    await act(async () => {
      settle().resolve();
      await loading;
    });
    expect(result.current.timed).toEqual({ state: "loaded", ms: expect.any(Number) });
  });

  it("fetches a remote once however many times it is asked for", async () => {
    const { remote, load, settle } = fakeRemote("once");

    const first = loadRemote(remote);
    const second = loadRemote(remote);
    settle().resolve();

    expect(second).toBe(first);
    await first;
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("records a failure and tries again on the next request", async () => {
    const { remote, load, settle } = fakeRemote("flaky");
    const { result } = renderHook(() => useRemoteStatuses());

    const failed = loadRemote(remote);
    await act(async () => {
      settle().reject(new Error("remoteEntry.js returned 404"));
      await failed.catch(() => {});
    });
    expect(result.current.flaky).toEqual({ state: "failed", error: "remoteEntry.js returned 404" });

    act(() => {
      void loadRemote(remote);
    });
    expect(load).toHaveBeenCalledTimes(2);
    expect(result.current.flaky).toEqual({ state: "loading" });
  });
});
