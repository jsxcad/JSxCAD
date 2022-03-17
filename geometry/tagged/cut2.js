import { cut as cutWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeMasked } from './type.js';
import { linearize } from './linearize.js';
import { replacer } from './visit.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

const filterTargets = (geometry) => ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type);
const filterRemoves = (geometry) => filterTargets(geometry) && isNotTypeMasked(geometry);

export const cut = (geometry, geometries) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets, inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filterRemoves, inputs);
  }
  const outputs = cutWithCgal(inputs, count);
  return replacer(inputs, outputs, count)(concreteGeometry);
};
