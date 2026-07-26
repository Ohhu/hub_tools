function schedulePanel() {
  if (!isTargetRoute()) return;
  if (mountTimer) return;
  mountTimer = requestFrame(() => {
    mountTimer = 0;
    ensurePanel();
  });
}

function requestFrame(callback) {
  return typeof requestAnimationFrame === "function" ? requestAnimationFrame(callback) : setTimeout(callback, 16);
}

function isTargetRoute(pathname = location.pathname) {
  return pathname.startsWith("/marketplace")
    || pathname.startsWith("/project/api-keys")
    || pathname.startsWith("/project/requests");
}

function handleRouteChange() {
  const route = `${location.pathname}${location.search || ""}`;
  if (lastPathname === route) return;
  lastPathname = route;
  scheduleRouteScans();
}

function scheduleRouteScans() {
  if (!isTargetRoute()) return;
  schedulePanel();
  setTimeout(schedulePanel, 120);
  setTimeout(schedulePanel, 360);
}
