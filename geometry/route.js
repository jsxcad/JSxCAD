import { isNotTypeGhost, isNotTypeVoid } from './tagged/type.js';

import { Group } from './Group.js';
import { linearize } from './tagged/linearize.js';
import { route as routeWithCgal } from '@jsxcad/algorithm-cgal';

const toolFilter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const segmentsFilter = (geometry) =>
  ['segments', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

export const Route = (tool, geometries) => {
  const inputs = [];
  linearize(tool, toolFilter, inputs);
  const toolCount = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, segmentsFilter, inputs);
  }
  const outputs = routeWithCgal(inputs, toolCount);
  return Group(outputs);
};
