import { startTransition, useCallback, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import Explorer from "./components/Explorer";
import Header from "./components/Header";
import RemoteApp from "./components/RemoteApp";
import { remotes } from "./remotes";

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  const signIn = useCallback(() => {
    setSignedIn(true);
    navigate("/dashboard");
  }, [navigate]);

  // React Router applies navigations as transitions. Signing out in the same transition stops
  // the dashboard route from redirecting to sign-in before the move to "/" lands.
  const signOut = () => {
    navigate("/");
    startTransition(() => setSignedIn(false));
  };

  return (
    <>
      <Header signedIn={signedIn} onSignOut={signOut} />
      <Routes>
        <Route
          path="/auth/*"
          element={<RemoteApp key="auth" remote={remotes.auth} onSignIn={signIn} />}
        />
        <Route
          path="/dashboard"
          element={
            signedIn ? (
              <RemoteApp key="dashboard" remote={remotes.dashboard} />
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route path="*" element={<RemoteApp key="marketing" remote={remotes.marketing} />} />
      </Routes>
      <Explorer />
    </>
  );
}
