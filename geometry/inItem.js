export const inItem = (geometry) => {
  if (geometry.type === 'item') {
    return geometry.content[0];
  }
  throw Error(`inItem: Not an item`);
};
