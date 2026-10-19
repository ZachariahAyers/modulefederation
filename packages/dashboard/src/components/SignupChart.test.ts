import { render } from "@testing-library/vue";
import Chart from "chart.js/auto";
import { describe, expect, it, vi } from "vitest";
import { signups } from "./sample-data";
import SignupChart from "./SignupChart.vue";

const { destroy } = vi.hoisted(() => ({ destroy: vi.fn() }));
vi.mock("chart.js/auto", () => ({
  default: vi.fn(function () {
    return { destroy };
  }),
}));

describe("SignupChart", () => {
  it("draws the sample sign-ups as a line chart on its canvas", () => {
    const { container } = render(SignupChart);

    const [canvas, config] = vi.mocked(Chart).mock.lastCall!;
    expect(canvas).toBe(container.querySelector("canvas"));
    expect(config).toMatchObject({
      type: "line",
      data: { labels: signups.labels, datasets: [{ data: signups.values }] },
    });
  });

  it("releases the chart when it unmounts", () => {
    const { unmount } = render(SignupChart);

    unmount();

    expect(destroy).toHaveBeenCalled();
  });
});
