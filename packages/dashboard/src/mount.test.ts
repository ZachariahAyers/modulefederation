import { screen } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";
import { mount } from "./mount";

vi.mock("chart.js/auto", () => ({
  default: vi.fn(function () {
    return { destroy: vi.fn() };
  }),
}));

describe("Dashboard remote", () => {
  it("renders into the element the host gives it and clears it on unmount", () => {
    const element = document.createElement("div");
    document.body.append(element);

    const app = mount(element, { initialPath: "/dashboard" });
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();

    app.unmount();
    expect(element).toBeEmptyDOMElement();
  });

  it("has no routes of its own, so it ignores host navigation", () => {
    const app = mount(document.createElement("div"));

    expect(app.onHostNavigate).toBeUndefined();
    app.unmount();
  });
});
