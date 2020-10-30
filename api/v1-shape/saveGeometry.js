import { read, write } from '@jsxcad/sys';

import Shape from './Shape.js';
import { hash } from '@jsxcad/geometry-tagged';

export const loadGeometry = async (path) =>
  Shape.fromGeometry(await read(path));

export const saveGeometry = async (path, shape) => {
  const disjointGeometry = shape.toDisjointGeometry();
  // Ensure that the geometry carries a hash before saving.
  hash(disjointGeometry);
  write(path, disjointGeometry);
  return Shape.fromGeometry(disjointGeometry);
};
