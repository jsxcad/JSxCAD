import {
  deletePendingSurfaceMeshes,
  join as joinWithCgal,
} from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type);

export const join = (geometry, geometries) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = joinWithCgal(inputs, count);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, count)(concreteGeometry);
};
