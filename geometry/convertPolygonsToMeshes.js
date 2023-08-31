import { convertPolygonsToMeshes as convertPolygonsToMeshesWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = () => (geometry) =>
  ['polygonsWithHoles'].includes(geometry.type);

export const convertPolygonsToMeshes = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter(), inputs);
  if (inputs.length === 0) {
    return geometry;
  }
  try {
    const outputs = convertPolygonsToMeshesWithCgal(inputs);
    return replacer(inputs, outputs)(concreteGeometry);
  } catch (e) {
    console.log(e.stack);
    throw e;
  }
};
