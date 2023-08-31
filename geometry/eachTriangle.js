import { eachTriangle as eachTriangleWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filterTargets = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const eachTriangle = (geometry, emitTriangle) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets, inputs);
  eachTriangleWithCgal(inputs, emitTriangle);
};
