import {
  deletePendingSurfaceMeshes,
  join as joinWithCgal,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeGhost, isTypeVoid } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid(geometry)));

const filterAdds = (noVoid) => (geometry) =>
  filter(geometry) &&
  (isNotTypeGhost(geometry) || !noVoid || isTypeVoid(geometry));

export const join = (geometry, geometries, exact, noVoid) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter(noVoid), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filterAdds(noVoid), inputs);
  }
  const outputs = joinWithCgal(inputs, count, exact);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, count)(concreteGeometry);
};
