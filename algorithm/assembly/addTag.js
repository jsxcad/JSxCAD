export const addTag = (tag, geometry) => {
  const copy = Object.assign({}, geometry);
  if (copy.tags) {
    copy.tags = [tag, ...copy.tags];
  } else {
    copy.tags = [tag];
  }
  return copy;
};
