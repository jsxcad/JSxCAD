import {
  deletePendingSurfaceMeshes,
  faceEdges as faceEdgesWithCgal,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const eachFaceEdges = (geometry, selections, emitFaceEdges) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter, inputs);
  }
  const outputs = faceEdgesWithCgal(inputs, count).filter(({ type }) =>
    ['polygonsWithHoles', 'segments'].includes(type)
  );
  for (let nth = 0; nth < outputs.length; nth += 2) {
    const face = outputs[nth + 0];
    const edges = outputs[nth + 1];
    emitFaceEdges(face, edges);
  }
  deletePendingSurfaceMeshes();
};
