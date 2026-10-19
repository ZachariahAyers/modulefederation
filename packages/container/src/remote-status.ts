import { useSyncExternalStore } from "react";
import type { Remote } from "./remotes";

export type RemoteStatus =
  { state: "loading" } | { state: "loaded"; ms: number } | { state: "failed"; error: string };

let statuses: Readonly<Record<string, RemoteStatus>> = {};
const listeners = new Set<() => void>();
const pending = new Map<string, Promise<unknown>>();

function setStatus(name: string, status: RemoteStatus) {
  statuses = { ...statuses, [name]: status };
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Every remote's load status, re-rendering when any of them changes. */
export const useRemoteStatuses = () => useSyncExternalStore(subscribe, () => statuses);

/** Loads a remote once, recording how long it took. A failed load is retried on the next call. */
export function loadRemote<Props extends object>(remote: Remote<Props>) {
  let loading = pending.get(remote.name) as ReturnType<Remote<Props>["load"]> | undefined;
  if (!loading) {
    const started = performance.now();
    setStatus(remote.name, { state: "loading" });
    loading = remote.load().then(
      (module) => {
        setStatus(remote.name, { state: "loaded", ms: Math.round(performance.now() - started) });
        return module;
      },
      (error: unknown) => {
        pending.delete(remote.name);
        setStatus(remote.name, {
          state: "failed",
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      },
    );
    pending.set(remote.name, loading);
  }
  return loading;
}
