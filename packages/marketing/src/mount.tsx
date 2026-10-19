import { createMount } from "@mfe/react-mount";
import HowItWorks from "./components/HowItWorks";
import Landing from "./components/Landing";
import NotFound from "./components/NotFound";

export const mount = createMount(() => [
  { path: "/", element: <Landing /> },
  { path: "/how-it-works", element: <HowItWorks /> },
  { path: "*", element: <NotFound /> },
]);
