// Fixed sample figures: the dashboard demonstrates composition, not a backend.
export const stats = [
  { label: "Active users", value: "1,284" },
  { label: "Sign-ups this week", value: "96" },
  { label: "Open issues", value: "21" },
];

export const signups = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: [9, 14, 11, 18, 16, 12, 16],
};

export const initialTasks = [
  { id: 1, text: "Review the Marketing release", done: true },
  { id: 2, text: "Bump the shared React range", done: false },
  { id: 3, text: "Add a fallback for the Auth remote", done: false },
  { id: 4, text: "Measure first load of the Dashboard", done: false },
];
