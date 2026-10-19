<script setup lang="ts">
import { computed, ref, version } from "vue";
import * as styles from "./DashboardPage.module.css";
import SignupChart from "./SignupChart.vue";
import { initialTasks, stats } from "./sample-data";

const tasks = ref(initialTasks.map((task) => ({ ...task })));
const remaining = computed(() => tasks.value.filter((task) => !task.done).length);
</script>

<template>
  <main :class="styles.page">
    <header :class="styles.header">
      <p :class="styles.eyebrow">Served by the Dashboard remote, Vue {{ version }}</p>
      <h1>Dashboard</h1>
      <p :class="styles.lead">
        A Vue application mounted inside the React host. Figures are sample data.
      </p>
    </header>

    <section :class="styles.stats" aria-label="Summary">
      <div v-for="stat in stats" :key="stat.label" :class="['card', styles.stat]">
        <span :class="styles.statValue">{{ stat.value }}</span>
        <span :class="styles.statLabel">{{ stat.label }}</span>
      </div>
    </section>

    <section :class="styles.panels">
      <div :class="['card', styles.panel]">
        <h2 :class="styles.panelTitle">Sign-ups per day</h2>
        <div :class="styles.chart">
          <SignupChart />
        </div>
      </div>

      <div :class="['card', styles.panel]">
        <h2 :class="styles.panelTitle">Tasks, {{ remaining }} left</h2>
        <ul :class="styles.tasks">
          <li v-for="task in tasks" :key="task.id">
            <label :class="[styles.task, task.done && styles.done]">
              <input v-model="task.done" type="checkbox" />
              {{ task.text }}
            </label>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
