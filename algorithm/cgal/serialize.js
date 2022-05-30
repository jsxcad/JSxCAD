import { computeHash } from '@jsxcad/sys';
import { withCgalGeometry } from './cgalGeometry.js';

export const serialize = (inputs, targetsLength) => {
  if (inputs.length === 0) {
    return;
  }
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    for (let nth = 0; nth < inputs.length; nth++) {
      const entry = inputs[nth];
      if (entry.type !== 'graph' || entry.graph.serializedSurfaceMesh) {
        continue;
      }
      entry.graph.serializedSurfaceMesh =
        cgalGeometry.getSerializedInputMesh(nth);
      entry.graph.hash = computeHash(entry.graph);
    }
  });
};
