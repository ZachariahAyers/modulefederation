import { NavLink, type NavLinkRenderProps } from "react-router";
import * as styles from "./Header.module.css";

const linkClass = ({ isActive }: NavLinkRenderProps) =>
  isActive ? `${styles.link} ${styles.active}` : styles.link;

interface HeaderProps {
  signedIn: boolean;
  onSignOut: () => void;
}

export default function Header({ signedIn, onSignOut }: HeaderProps) {
  return (
    <header className={styles.header}>
      <NavLink className={styles.brand} to="/">
        Module Federation
      </NavLink>
      <nav className={styles.nav} aria-label="Main">
        <NavLink className={linkClass} to="/how-it-works">
          How it works
        </NavLink>
        {signedIn && (
          <NavLink className={linkClass} to="/dashboard">
            Dashboard
          </NavLink>
        )}
        {signedIn ? (
          <button className="button secondary" type="button" onClick={onSignOut}>
            Sign out
          </button>
        ) : (
          <NavLink className="button secondary" to="/auth/signin">
            Sign in
          </NavLink>
        )}
      </nav>
    </header>
  );
}
