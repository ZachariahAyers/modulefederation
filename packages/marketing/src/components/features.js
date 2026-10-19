export const features = [
  {
    title: "Runtime composition",
    body: "The host learns where each app lives from its remote entry and loads it in the browser. Nothing is linked at build time.",
  },
  {
    title: "Independent deploys",
    body: "Each app builds and ships on its own. Redeploy Marketing and the host picks it up on the next page load.",
  },
  {
    title: "Shared dependencies",
    body: "React, React DOM, React Router and Vue load once as singletons. Every app declares the version range it accepts.",
  },
  {
    title: "Framework agnostic",
    body: "The Dashboard is a Vue 3 app running inside a React host. Each remote exposes a plain mount function.",
  },
  {
    title: "Style isolation",
    body: "Every app uses CSS Modules with its own name prefix, so two apps can both have a .title class without colliding.",
  },
  {
    title: "Load on demand",
    body: "A remote's code downloads only when its route is first visited. The explorer panel shows the measured time.",
  },
  {
    title: "Failure isolation",
    body: "If a remote cannot load, the host shows a notice in its place and the rest of the page keeps working.",
  },
  {
    title: "Team ownership",
    body: "One team per app, end to end: code, build, release. The contract between them is a mount function and a path.",
  },
];
