import "@mfe/theme/global.css";
import { mount } from "./mount";

// On its own there is no host to sign in to, so a sign-in just returns to the form.
mount(document.getElementById("root")!, { standalone: true, onSignIn: () => {} });
