import {
  deletePendingSurfaceMeshes,
  wrap as wrapWithCgal,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

export const wrap = (geometries, offset, alpha) => {
  const inputs = [];
  for (const geometry of geometries) {
    const concreteGeometry = toConcreteGeometry(geometry);
    linearize(concreteGeometry, filter, inputs);
  }
  const outputs = wrapWithCgal(inputs, offset, alpha);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};
