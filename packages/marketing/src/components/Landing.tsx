import { Link } from "react-router";
import { features } from "./features";
import * as styles from "./Landing.module.css";

export default function Landing() {
  return (
    <main>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Served by the Marketing remote</p>
        <h1 className={styles.title}>Four apps, one page</h1>
        <p className={styles.lead}>
          This page is assembled in the browser from independently built and deployed applications.
          Two frameworks, one shared copy of each library, no iframes.
        </p>
        <div className={styles.actions}>
          <Link className="button" to="/auth/signin">
            Sign in to the dashboard
          </Link>
          <Link className="button secondary" to="/how-it-works">
            How it works
          </Link>
        </div>
      </section>

      <section className={styles.grid} aria-label="What this demonstrates">
        {features.map(({ title, body }) => (
          <article key={title} className={`card ${styles.feature}`}>
            <h2 className={styles.featureTitle}>{title}</h2>
            <p className={styles.featureBody}>{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
