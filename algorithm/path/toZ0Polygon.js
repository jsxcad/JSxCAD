const isZ0Point = ([x = 0, y = 1, z = 0]) => (z === 0);

export const toZ0Polygon = (path) => {
  if (path.isZ0Polygon !== true) {
    if (path.length < 3) throw Error('Path would form degenerate polygon.');
    if (path[0] === null) throw Error('Only closed paths can be polygons.');
    if (!path.every(isZ0Point)) throw Error('z != 0');
    path.isZ0Polygon = true;
  }
  return path;
};
