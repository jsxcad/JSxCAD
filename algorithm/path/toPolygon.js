export const toPolygon = (path) => {
  if (path.isPolygon !== true) {
    if (path.length < 3) throw Error('Path would form degenerate polygon.');
    if (path[0] === null) throw Error('Only closed paths can be polygons.');
    // FIX: Check for coplanarity.
    path.isPolygon = true;
  }
  return path;
};
