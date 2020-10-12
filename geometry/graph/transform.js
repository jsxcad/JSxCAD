import { nefPolyhedronSymbol, surfaceMeshSymbol } from './symbols.js';

import { transform as transformPlane } from '@jsxcad/math-plane';
import { transform as transformPoint } from '@jsxcad/math-vec3';

// FIX: Precision loss.
export const transform = (matrix, graph) => {
  const transformedPoints = [];
  for (let nth = 0; nth < graph.points.length; nth++) {
    const point = graph.points[nth];
    if (point !== undefined) {
      transformedPoints[nth] = transformPoint(matrix, point);
    }
  }

  const transformedFaces = graph.faces.map((face) => ({
    ...face,
    plane: face.plane ? transformPlane(matrix, face.plane) : face.plane,
  }));

  return {
    ...graph,
    points: transformedPoints,
    faces: transformedFaces,
    [nefPolyhedronSymbol]: undefined,
    [surfaceMeshSymbol]: undefined,
  };
};
