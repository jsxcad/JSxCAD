import { Group } from './Group.js';
import { inset as insetWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const inset = (
  geometry,
  initial = 1,
  { segments = 16, step, limit } = {}
) => {
  const inputs = linearize(geometry, filter);
  const outputs = insetWithCgal(inputs, initial, step, limit, segments);
  // Inner insets should come first.
  return Group(outputs);
};
