import { useSyncExternalStore } from "react";

let statuses = {};
const listeners = new Set();
const pending = new Map();

function setStatus(name, status) {
  statuses = { ...statuses, [name]: status };
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useRemoteStatuses = () => useSyncExternalStore(subscribe, () => statuses);

/** Loads a remote once, recording how long it took. A failed load is retried on the next visit. */
export function loadRemote(remote) {
  if (!pending.has(remote.name)) {
    const started = performance.now();
    setStatus(remote.name, { state: "loading" });
    const loading = remote.load().then(
      (module) => {
        setStatus(remote.name, { state: "loaded", ms: Math.round(performance.now() - started) });
        return module;
      },
      (error) => {
        pending.delete(remote.name);
        setStatus(remote.name, { state: "failed", error: error?.message ?? String(error) });
        throw error;
      },
    );
    pending.set(remote.name, loading);
  }
  return pending.get(remote.name);
}
