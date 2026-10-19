import type { MountedApp } from "@mfe/contract";
import { useEffect, useEffectEvent, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadRemote, useRemoteStatuses } from "../remote-status";
import type { Remote } from "../remotes";
import * as styles from "./RemoteApp.module.css";

type RemoteAppProps<Props extends object> = { remote: Remote<Props> } & Props;

/** Mounts one remote into a DOM node and keeps its router on the host's path. */
export default function RemoteApp<Props extends object>({
  remote,
  ...props
}: RemoteAppProps<Props>) {
  const node = useRef<HTMLDivElement>(null);
  const app = useRef<MountedApp | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const status = useRemoteStatuses()[remote.name];

  const mountRemote = useEffectEvent(({ mount }: Awaited<ReturnType<Remote<Props>["load"]>>) => {
    if (!node.current) return;
    app.current = mount(node.current, {
      initialPath: pathname,
      onNavigate: (path) => void navigate(path),
      ...(props as Props),
    });
  });

  useEffect(() => {
    let active = true;
    loadRemote(remote).then(
      (module) => active && mountRemote(module),
      () => {}, // The failure is shown from the status store.
    );
    return () => {
      active = false;
      const mounted = app.current;
      app.current = null;
      // A root cannot be unmounted while the host is still committing.
      queueMicrotask(() => mounted?.unmount());
    };
  }, [remote]);

  useEffect(() => {
    app.current?.onHostNavigate?.(pathname);
  }, [pathname]);

  if (status?.state === "failed") {
    return (
      <div className={`card ${styles.failed}`} role="alert">
        <h2>{remote.label} is unavailable</h2>
        <p>
          Its remote entry could not be loaded. The rest of the page still works; reload to try
          again.
        </p>
      </div>
    );
  }

  return (
    <>
      {status?.state === "loading" && (
        <div
          className={styles.progress}
          role="progressbar"
          aria-label={`Loading ${remote.label}`}
        />
      )}
      <div ref={node} />
    </>
  );
}
