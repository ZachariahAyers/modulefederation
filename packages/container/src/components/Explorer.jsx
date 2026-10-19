import { remotes } from "../remotes.js";
import { useRemoteStatuses } from "../remote-status.js";
import * as styles from "./Explorer.module.css";

// Written at build time from the same configuration Module Federation uses.
const { entries, shared } = __FEDERATION__;

const describe = (status) => {
  if (!status) return "Not loaded yet";
  if (status.state === "loading") return "Loading";
  if (status.state === "failed") return `Failed: ${status.error}`;
  return `Loaded in ${status.ms} ms`;
};

export default function Explorer() {
  const statuses = useRemoteStatuses();

  return (
    <details className={styles.panel}>
      <summary className={styles.summary}>Module Federation explorer</summary>
      <div className={styles.body}>
        <section>
          <h2 className={styles.heading}>Remotes</h2>
          <ul className={styles.remotes}>
            {Object.values(remotes).map((remote) => {
              const status = statuses[remote.name];
              return (
                <li key={remote.name} className={styles.remote} data-state={status?.state ?? "idle"}>
                  <span className={styles.name}>
                    {remote.label}
                    <span className={styles[remote.framework.toLowerCase()]}>{remote.framework}</span>
                  </span>
                  <code className={styles.entry}>{entries[remote.name]}</code>
                  <span className={styles.status}>{describe(status)}</span>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h2 className={styles.heading}>Shared by the host</h2>
          <ul className={styles.shared}>
            {shared.map(({ name, version, singleton }) => (
              <li key={name}>
                <code>
                  {name}@{version}
                </code>
                {singleton && <span className={styles.singleton}>singleton</span>}
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Remotes reuse these copies when their declared version range allows it.
          </p>
        </section>
      </div>
    </details>
  );
}
