import { transform as transformPoints } from '@jsxcad/geometry-points';

export const transform = (matrix, graph) => ({
  ...graph,
  points: transformPoints(matrix, graph.points),
});
