import { Link } from "react-router";
import * as styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <h1>Page not found</h1>
      <p className={styles.lead}>Nothing here belongs to any of the four apps.</p>
      <Link className="button" to="/">
        Back to the overview
      </Link>
    </main>
  );
}
