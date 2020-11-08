import { realizeGraph } from './realizeGraph.js';

// FIX: Actually determine the principle plane.
export const principlePlane = (graph) => {
  for (const face of realizeGraph(graph).faces) {
    if (face && face.plane) {
      return face.plane;
    }
  }
};
