export const inItem = (geometry) => {
  if (geometry.type === 'item') {
    return geometry.content[0];
  } else {
    return geometry;
  }
};
