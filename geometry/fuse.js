import { Group } from './Group.js';
import { fuse as fuseWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const Fuse = (geometries, { exact } = {}) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = fuseWithCgal(inputs, exact);
  return Group(outputs);
};

export const fuse = (geometry, geometries, { exact }) =>
  Fuse([geometry, ...geometries], { exact });
