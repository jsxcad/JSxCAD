import { tag, tags } from './tag.js';

import { Group } from './Group.js';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { wrap as wrapWithCgal } from '@jsxcad/algorithm-cgal';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

// These defaults need some rethinking.
export const Wrap = (
  geometries,
  offset = 1,
  alpha = 0.1,
  faceCount = 0,
  minErrorDrop = 0.01
) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = wrapWithCgal(inputs, offset, alpha, faceCount, minErrorDrop);
  return Group(outputs);
};

export const wrap = (
  geometry,
  geometries,
  offset,
  alpha,
  faceCount,
  minErrorDrop
) =>
  tag(
    Wrap([geometry, ...geometries], offset, alpha, faceCount, minErrorDrop),
    tags(geometry)
  );
