import { faceEdges as faceEdgesWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const eachFaceEdges = (
  geometry,
  { select = [] } = {},
  emitFaceEdges
) => {
  if (!(select instanceof Array)) {
    select = [select];
  }
  const inputs = linearize(geometry, filter);
  const count = inputs.length;
  for (const selection of select) {
    linearize(selection, filter, inputs);
  }
  const outputs = faceEdgesWithCgal(inputs, count).filter(({ type }) =>
    ['polygonsWithHoles', 'segments'].includes(type)
  );
  for (let nth = 0; nth < outputs.length; nth += 2) {
    const face = outputs[nth + 0];
    const edges = outputs[nth + 1];
    emitFaceEdges(face, edges);
  }
};

export const toFaceEdgesList = (geometry, options) => {
  const faceEdges = [];
  eachFaceEdges(geometry, options, (face, edges) =>
    faceEdges.push({ face, edges })
  );
  return faceEdges;
};
