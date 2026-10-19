/**
 * Keeps a remote's router and its host's router on the same path.
 * Returns the callback the host calls when its own location changes,
 * and a function that stops listening.
 */
export function syncWithHost(router, onNavigate) {
  let hostPath = router.state.location.pathname;

  const stop = router.subscribe(({ location }) => {
    if (location.pathname !== hostPath) {
      hostPath = location.pathname;
      onNavigate(location.pathname);
    }
  });

  const onHostNavigate = (pathname) => {
    hostPath = pathname;
    if (router.state.location.pathname !== pathname) router.navigate(pathname);
  };

  return { onHostNavigate, stop };
}
