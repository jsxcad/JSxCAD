const walk = (array, emit) => array.forEach(item => (item instanceof Array) ? walk(item, emit) : emit(item));

export const flatten = (array) => {
  const flattened = [];
  walk(array, item => flattened.push(item));
  return flattened;
}
