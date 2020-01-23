export const update = (geometry, updates) => {
  const updated = {};
  for (const key of Object.keys(geometry)) {
    if (typeof key !== 'symbol') {
      updated[key] = geometry[key];
    }
  }
  for (const key of Object.keys(updates)) {
    updated[key] = updates[key];
  }
  return updated;
};
