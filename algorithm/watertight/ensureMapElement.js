export const ensureMapElement = (map, key, ensurer = (_ => [])) => {
  if (!map.has(key)) {
    map.set(key, ensurer());
  }
  return map.get(key);
};
