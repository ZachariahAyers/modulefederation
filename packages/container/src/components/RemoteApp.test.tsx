import type { Mount, MountedApp, MountOptions } from "@mfe/contract";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Route, Routes, useLocation } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { Remote } from "../remotes";
import RemoteApp from "./RemoteApp";

function fakeRemote(name: string) {
  const mounted: MountedApp = { unmount: vi.fn(), onHostNavigate: vi.fn() };
  const mount = vi.fn<Mount<{ greeting?: string }>>((element) => {
    element.textContent = `${name} content`;
    return mounted;
  });
  const remote: Remote<{ greeting?: string }> = {
    name,
    label: name,
    framework: "React",
    load: () => Promise.resolve({ mount }),
  };
  return { remote, mount, mounted };
}

function Location() {
  return <output aria-label="host path">{useLocation().pathname}</output>;
}

function renderAt(path: string, remote: Remote<{ greeting?: string }>, greeting?: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Link to="/other">Other</Link>
      <Location />
      <Routes>
        <Route path="*" element={<RemoteApp remote={remote} greeting={greeting} />} />
      </Routes>
    </MemoryRouter>,
  );
}

const lastOptions = (mount: ReturnType<typeof fakeRemote>["mount"]) =>
  mount.mock.lastCall![1] as MountOptions & { greeting?: string };

describe("RemoteApp", () => {
  it("mounts the remote with the host's path and the extra props", async () => {
    const { remote, mount } = fakeRemote("mounts");

    renderAt("/start", remote, "hi");

    expect(await screen.findByText("mounts content")).toBeInTheDocument();
    expect(lastOptions(mount)).toMatchObject({ initialPath: "/start", greeting: "hi" });
  });

  it("tells the remote when the host navigates", async () => {
    const { remote, mounted } = fakeRemote("follows");
    renderAt("/start", remote);
    await screen.findByText("follows content");

    await userEvent.click(screen.getByRole("link", { name: "Other" }));

    expect(mounted.onHostNavigate).toHaveBeenLastCalledWith("/other");
  });

  it("moves the host when the remote navigates", async () => {
    const { remote, mount } = fakeRemote("leads");
    renderAt("/start", remote);
    await screen.findByText("leads content");

    act(() => lastOptions(mount).onNavigate?.("/inside"));

    expect(screen.getByRole("status", { name: "host path" })).toHaveTextContent("/inside");
  });

  it("shows a notice in place of a remote that cannot load", async () => {
    const remote: Remote = {
      name: "broken",
      label: "Broken",
      framework: "Vue",
      load: () => Promise.reject(new Error("offline")),
    };

    renderAt("/", remote);

    expect(await screen.findByRole("alert")).toHaveTextContent("Broken is unavailable");
  });

  it("unmounts the remote when the host leaves its route", async () => {
    const { remote, mounted } = fakeRemote("leaves");
    const { unmount } = renderAt("/", remote);
    await screen.findByText("leaves content");

    unmount();

    await waitFor(() => expect(mounted.unmount).toHaveBeenCalledTimes(1));
  });
});
