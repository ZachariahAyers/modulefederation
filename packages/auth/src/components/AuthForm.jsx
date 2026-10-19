import { Link } from "react-router";
import * as styles from "./AuthForm.module.css";

const copy = {
  signin: {
    title: "Sign in",
    submit: "Sign in",
    switchText: "No account yet?",
    switchLink: "Create one",
    switchTo: "/auth/signup",
  },
  signup: {
    title: "Create an account",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLink: "Sign in",
    switchTo: "/auth/signin",
  },
};

export default function AuthForm({ mode, onSignIn }) {
  const text = copy[mode];

  const submit = (event) => {
    event.preventDefault();
    onSignIn();
  };

  return (
    <main className={styles.page}>
      <form className={`card ${styles.form}`} onSubmit={submit}>
        <p className={styles.eyebrow}>Served by the Auth remote</p>
        <h1 className={styles.title}>{text.title}</h1>

        {mode === "signup" && (
          <label className={styles.field}>
            Name
            <input name="name" autoComplete="name" required />
          </label>
        )}
        <label className={styles.field}>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className={styles.field}>
          Password
          <input
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
          />
        </label>

        <button className={`button ${styles.submit}`} type="submit">
          {text.submit}
        </button>
        <p className={styles.note}>
          Demo only: any values sign you in, and nothing leaves the browser.
        </p>
        <p className={styles.switch}>
          {text.switchText} <Link to={text.switchTo}>{text.switchLink}</Link>
        </p>
      </form>
    </main>
  );
}
