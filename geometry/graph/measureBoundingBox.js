import { max, min } from '@jsxcad/math-vec3';

import { realizeGraph } from './realizeGraph.js';

export const measureBoundingBox = (graph) => {
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];
  for (const point of realizeGraph(graph).points) {
    if (point !== undefined) {
      minPoint = min(minPoint, point);
      maxPoint = max(maxPoint, point);
    }
  }
  return [minPoint, maxPoint];
};
