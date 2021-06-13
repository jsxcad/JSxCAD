import { identityMatrix } from '@jsxcad/math-mat4';
import { realizeGraph } from './realizeGraph.js';
import { transform } from '@jsxcad/math-vec3';

// FIX: Let's avoid a complete realization of the graph.
export const eachPoint = (geometry, op) => {
  for (const point of realizeGraph(geometry).graph.points) {
    if (point !== undefined) {
      op(transform(geometry.matrix || identityMatrix, point));
    }
  }
};
