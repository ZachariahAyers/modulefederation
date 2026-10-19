import type { AuthProps, Mount } from "@mfe/contract";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

// Each fake remote prints which app is showing and the path it was given.
const { fakeMount } = vi.hoisted(() => ({
  fakeMount:
    (label: string): Mount<Partial<AuthProps>> =>
    (element, options) => {
      element.textContent = `${label} at ${options?.initialPath}`;
      if (options?.onSignIn) {
        const button = document.createElement("button");
        button.textContent = "Fake sign in";
        button.addEventListener("click", options.onSignIn);
        element.append(button);
      }
      return { unmount: () => element.replaceChildren() };
    },
}));

vi.mock("./remotes", () => ({
  remotes: Object.fromEntries(
    ["marketing", "auth", "dashboard"].map((name) => [
      name,
      { name, label: name, framework: "React", load: async () => ({ mount: fakeMount(name) }) },
    ]),
  ),
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe("App", () => {
  it("shows Marketing for the overview and any path no other app owns", async () => {
    renderAt("/how-it-works");

    expect(await screen.findByText("marketing at /how-it-works")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("sends a signed-out visitor from the dashboard to sign in", async () => {
    renderAt("/dashboard");

    expect(await screen.findByText(/auth at \/auth\/signin/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("opens the dashboard after sign-in and returns to the overview on sign-out", async () => {
    renderAt("/auth/signin");

    await userEvent.click(await screen.findByRole("button", { name: "Fake sign in" }));

    expect(await screen.findByText("dashboard at /dashboard")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect(await screen.findByText("marketing at /")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });
});
