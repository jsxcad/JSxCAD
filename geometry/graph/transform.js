import { transform as transformPoints } from '@jsxcad/geometry-points';

export const transform = (matrix, graph) => ({ ...graph, point: transformPoints(matrix, graph.point) });
