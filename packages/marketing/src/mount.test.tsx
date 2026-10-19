import type { MountedApp } from "@mfe/contract";
import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { features } from "./components/features";
import { mount } from "./mount";

let app: MountedApp | undefined;

function mountAt(initialPath: string, onNavigate = vi.fn()) {
  const element = document.createElement("div");
  document.body.append(element);
  act(() => {
    app = mount(element, { initialPath, onNavigate });
  });
  return onNavigate;
}

afterEach(() => {
  act(() => app?.unmount());
  document.body.replaceChildren();
});

describe("Marketing remote", () => {
  it("shows the overview with one card per feature", () => {
    mountAt("/");

    expect(screen.getByRole("heading", { level: 1, name: "Four apps, one page" })).toBeVisible();
    const list = screen.getByRole("region", { name: "What this demonstrates" });
    expect(within(list).getAllByRole("article")).toHaveLength(features.length);
  });

  it("asks the host to navigate when a link inside it is followed", async () => {
    const onNavigate = mountAt("/");

    await userEvent.click(screen.getByRole("link", { name: "How it works" }));

    expect(onNavigate).toHaveBeenCalledWith("/how-it-works");
    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("names the app that renders each path", () => {
    mountAt("/how-it-works");

    const dashboardRow = screen.getByRole("cell", { name: "/dashboard" }).closest("tr")!;
    expect(within(dashboardRow).getByRole("cell", { name: "Vue" })).toBeInTheDocument();
  });

  it("says so when a path belongs to no app", () => {
    mountAt("/no-such-page");

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});
