import { createMount } from "@mfe/react-mount";
import HowItWorks from "./components/HowItWorks.jsx";
import Landing from "./components/Landing.jsx";

export const mount = createMount(() => [
  { path: "/how-it-works", element: <HowItWorks /> },
  { path: "*", element: <Landing /> },
]);
