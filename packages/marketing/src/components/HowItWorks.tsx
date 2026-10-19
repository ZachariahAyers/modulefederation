import { Link } from "react-router";
import * as styles from "./HowItWorks.module.css";

const routes = [
  { path: "/", app: "Marketing", framework: "React" },
  { path: "/how-it-works", app: "Marketing", framework: "React" },
  { path: "/auth/*", app: "Auth", framework: "React" },
  { path: "/dashboard", app: "Dashboard", framework: "Vue" },
];

const steps = [
  "The browser loads the Container's page and script.",
  "The Container matches the URL and asks the runtime for that route's remote.",
  "The runtime fetches the remote's remoteEntry.js and checks which shared packages are already loaded.",
  "Shared packages already on the page are reused; anything missing is downloaded once.",
  "The Container calls the remote's mount function with a DOM node and the current path.",
  "From then on the two routers report navigations to each other, so the address bar stays correct.",
];

export default function HowItWorks() {
  return (
    <main className={styles.page}>
      <h1>How it works</h1>
      <p className={styles.lead}>
        The Container owns the URL. Each path belongs to one remote, which the Container loads the
        first time that path is visited.
      </p>

      <div className={`card ${styles.tableWrap}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Path</th>
              <th scope="col">Rendered by</th>
              <th scope="col">Framework</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(({ path, app, framework }) => (
              <tr key={path}>
                <td className={styles.path}>{path}</td>
                <td>{app}</td>
                <td>{framework}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={styles.subhead}>What happens on a first visit</h2>
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <Link className="button secondary" to="/">
        Back to the overview
      </Link>
    </main>
  );
}
