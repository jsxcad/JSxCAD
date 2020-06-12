export const update = (geometry, updates) => {
  if (geometry === updates) {
    return geometry;
  }
  const updated = {};
  for (const key of Object.keys(geometry)) {
    if (typeof key !== "symbol") {
      updated[key] = geometry[key];
    }
  }
  let changed = false;
  for (const key of Object.keys(updates)) {
    if (updates[key] !== updated[key]) {
      updated[key] = updates[key];
      changed = true;
    }
  }
  if (changed) {
    return updated;
  } else {
    return geometry;
  }
};
