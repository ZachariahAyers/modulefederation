import { createMount } from "@mfe/react-mount";
import { Navigate } from "react-router";
import AuthForm from "./components/AuthForm.jsx";

export const mount = createMount(({ onSignIn }) => [
  { path: "/auth/signin", element: <AuthForm mode="signin" onSignIn={onSignIn} /> },
  { path: "/auth/signup", element: <AuthForm mode="signup" onSignIn={onSignIn} /> },
  { path: "*", element: <Navigate to="/auth/signin" replace /> },
]);
