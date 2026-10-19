<script setup lang="ts">
import Chart from "chart.js/auto";
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { signups } from "./sample-data";

const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
let chart: Chart | undefined;

onMounted(() => {
  if (!canvas.value) return;
  const accent = getComputedStyle(canvas.value).getPropertyValue("--vue").trim();
  chart = new Chart(canvas.value, {
    type: "line",
    data: {
      labels: signups.labels,
      datasets: [
        { label: "Sign-ups", data: signups.values, borderColor: accent, backgroundColor: accent },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
});

onBeforeUnmount(() => chart?.destroy());
</script>

<template>
  <canvas ref="canvas" aria-label="Sign-ups per day, sample data" role="img" />
</template>
