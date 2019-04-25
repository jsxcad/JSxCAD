export const addTag = (tag, geometry) => {
  const copy = Object.assign({ tags: [] }, geometry);
  copy.tags = [tag, ...copy.tags];
  return copy;
};
