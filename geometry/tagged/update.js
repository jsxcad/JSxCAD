export const update = (geometry, updates, changes) => {
  if (updates === undefined) {
    return geometry;
  }
  if (geometry === updates) {
    return geometry;
  }
  const updated = {};
  for (const key of Object.keys(geometry)) {
    if (key === 'cache') {
      // Caches contains derivations from the original object.
      continue;
    }
    if (key === 'hash') {
      // Hash is a bit like a symbol, but we want it to persist.
      continue;
    }
    if (typeof key === 'symbol') {
      // Don't copy symbols.
      continue;
    }
    updated[key] = geometry[key];
  }
  let changed = false;
  for (const key of Object.keys(updates)) {
    if (updates[key] !== updated[key]) {
      updated[key] = updates[key];
      changed = true;
    }
  }
  if (changes !== undefined) {
    for (const key of Object.keys(changes)) {
      if (changes[key] !== updated[key]) {
        updated[key] = changes[key];
        changed = true;
      }
    }
  }
  if (changed) {
    return updated;
  } else {
    return geometry;
  }
};
