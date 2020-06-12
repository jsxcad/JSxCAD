// Remove any symbols (which refer to cached values).
export const fresh = (geometry) => {
  const fresh = {};
  for (const key of Object.keys(geometry)) {
    if (typeof key !== "symbol") {
      fresh[key] = geometry[key];
    }
  }
  return fresh;
};
