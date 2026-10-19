import { act, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { loadRemote } from "../remote-status";
import { remotes } from "../remotes";
import Explorer from "./Explorer";

vi.mock("../remotes", () => ({
  remotes: {
    marketing: {
      name: "marketing",
      label: "Marketing",
      framework: "React",
      load: async () => ({ mount: vi.fn() }),
    },
    dashboard: {
      name: "dashboard",
      label: "Dashboard",
      framework: "Vue",
      load: () => Promise.reject(new Error("offline")),
    },
  },
}));

const row = (label: string) => screen.getByText(label).closest("li")!;

describe("Explorer", () => {
  it("lists every remote with its entry URL before anything loads", () => {
    render(<Explorer />);

    expect(within(row("Marketing")).getByText("/marketing/remoteEntry.js")).toBeInTheDocument();
    expect(within(row("Marketing")).getByText("Not loaded yet")).toBeInTheDocument();
    expect(within(row("Dashboard")).getByText("Vue")).toBeInTheDocument();
  });

  it("shows the measured load time, or the reason a load failed", async () => {
    render(<Explorer />);

    await act(async () => {
      await loadRemote(remotes.marketing);
      await loadRemote(remotes.dashboard).catch(() => {});
    });

    expect(within(row("Marketing")).getByText(/^Loaded in \d+ ms$/)).toBeInTheDocument();
    expect(within(row("Dashboard")).getByText("Failed: offline")).toBeInTheDocument();
  });

  it("lists the packages the host shares and marks the singletons", () => {
    render(<Explorer />);

    const react = screen.getByText("react@19.3.1").closest("li")!;
    expect(within(react).getByText("singleton")).toBeInTheDocument();
  });
});
