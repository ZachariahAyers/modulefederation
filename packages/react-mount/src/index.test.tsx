import type { MountedApp, MountOptions } from "@mfe/contract";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMount } from "./index";

const mount = createMount<{ greeting: string }>(({ greeting }) => [
  {
    path: "/",
    element: (
      <>
        <h1>{greeting}</h1>
        <Link to="/next">Next</Link>
      </>
    ),
  },
  { path: "/next", element: <h1>Next page</h1> },
]);

const mounted: MountedApp[] = [];

function mountInto(options: MountOptions & { greeting: string }) {
  const element = document.createElement("div");
  document.body.append(element);
  let app!: MountedApp;
  act(() => {
    app = mount(element, options);
  });
  mounted.push(app);
  return { element, app };
}

afterEach(() => {
  act(() => mounted.splice(0).forEach((app) => app.unmount()));
  document.body.replaceChildren();
  window.history.replaceState(null, "", "/");
});

describe("createMount", () => {
  it("renders the route for the host's path and hands extra options to the routes", () => {
    mountInto({ initialPath: "/", greeting: "Hello from a remote" });

    expect(screen.getByRole("heading", { name: "Hello from a remote" })).toBeInTheDocument();
  });

  it("reports a navigation inside the remote to the host", async () => {
    const onNavigate = vi.fn();
    mountInto({ initialPath: "/", onNavigate, greeting: "Hi" });

    await userEvent.click(screen.getByRole("link", { name: "Next" }));

    expect(onNavigate).toHaveBeenCalledWith("/next");
    expect(await screen.findByRole("heading", { name: "Next page" })).toBeInTheDocument();
  });

  it("moves to the host's new path", async () => {
    const { app } = mountInto({ initialPath: "/", greeting: "Hi" });

    act(() => app.onHostNavigate?.("/next"));

    expect(await screen.findByRole("heading", { name: "Next page" })).toBeInTheDocument();
  });

  it("owns the browser URL when standalone", () => {
    window.history.replaceState(null, "", "/next");

    mountInto({ standalone: true, greeting: "Hi" });

    expect(screen.getByRole("heading", { name: "Next page" })).toBeInTheDocument();
  });

  it("removes everything it rendered on unmount", () => {
    const { element, app } = mountInto({ initialPath: "/", greeting: "Hi" });
    mounted.pop();

    act(() => app.unmount());

    expect(element).toBeEmptyDOMElement();
  });
});
