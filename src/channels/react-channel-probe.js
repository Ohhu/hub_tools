function findDirectReactChannel(node) {
  for (const key of Object.keys(node || {})) {
    if (key.startsWith("__reactProps$")) {
      const channel = pickReactChannel(node[key]);
      if (channel) return channel;
    } else if (key.startsWith("__reactFiber$")) {
      const channel = findChannelInFiber(node[key]);
      if (channel) return channel;
    }
  }
  return null;
}

function findChannelInFiber(fiber) {
  let current = fiber;
  for (let depth = 0; current && depth < REACT_FIBER_CHANNEL_LOOKUP_LIMIT; depth += 1, current = current.return) {
    const channel = pickReactChannel(current.memoizedProps) || pickReactChannel(current.pendingProps);
    if (channel) return channel;
  }
  return null;
}

function pickReactChannel(props) {
  if (!props || typeof props !== "object" || Array.isArray(props)) return null;
  if (isChannelObject(props)) return props;
  for (const key of ["channel", "node", "data", "item", "row"]) {
    if (isChannelObject(props[key])) return props[key];
  }
  return null;
}
