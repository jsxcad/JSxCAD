const walk = (array, emit) => array.forEach(item => (item instanceof Array) ? walk(item, emit) : emit(item));

export const flatten = (array) => {
  if (array.some(item => item === undefined)) throw Error('die');
  const flattened = [];
  walk(array, item => flattened.push(item));
  if (flattened.some(item => item === undefined)) throw Error('die');
  return flattened;
};
