import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "./DashboardPage.vue";
import { initialTasks, stats } from "./sample-data";

vi.mock("chart.js/auto", () => ({
  default: vi.fn(function () {
    return { destroy: vi.fn() };
  }),
}));

describe("DashboardPage", () => {
  it("labels its figures as sample data and shows each one", () => {
    render(DashboardPage);

    expect(screen.getByText(/Figures are sample data/)).toBeInTheDocument();
    for (const { label, value } of stats) {
      expect(screen.getByText(label).previousElementSibling).toHaveTextContent(value);
    }
  });

  it("counts the tasks left and updates the count as tasks are ticked", async () => {
    render(DashboardPage);
    const left = initialTasks.filter((task) => !task.done).length;
    expect(screen.getByRole("heading", { name: `Tasks, ${left} left` })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("checkbox", { name: "Bump the shared React range" }));

    expect(screen.getByRole("heading", { name: `Tasks, ${left - 1} left` })).toBeInTheDocument();
  });

  it("starts each mount from the sample tasks rather than the last visit's", async () => {
    const first = render(DashboardPage);
    await userEvent.click(screen.getByRole("checkbox", { name: "Bump the shared React range" }));
    first.unmount();

    render(DashboardPage);

    expect(screen.getByRole("checkbox", { name: "Bump the shared React range" })).not.toBeChecked();
  });
});
