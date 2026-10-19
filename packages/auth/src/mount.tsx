import type { AuthProps } from "@mfe/contract";
import { createMount } from "@mfe/react-mount";
import { Navigate } from "react-router";
import AuthForm from "./components/AuthForm";

export const mount = createMount<AuthProps>(({ onSignIn }) => [
  { path: "/auth/signin", element: <AuthForm mode="signin" onSignIn={onSignIn} /> },
  { path: "/auth/signup", element: <AuthForm mode="signup" onSignIn={onSignIn} /> },
  { path: "*", element: <Navigate to="/auth/signin" replace /> },
]);
