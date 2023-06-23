import {
  deletePendingSurfaceMeshes,
  fuse as fuseWithCgal,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const Fuse = (geometries, { exact }) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = fuseWithCgal(inputs, exact);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

export const fuse = (geometry, geometries, { exact }) =>
  Fuse([geometry, ...geometries], { exact });
