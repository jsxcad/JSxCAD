import { Edge, Group } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Line = Shape.registerMethod3(
  ['Line', 'LineX'],
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge([begin, 0, 0], [end, 0, 0]));
    }
    return Group(edges);
  }
);

export const LineX = Line;

export const LineY = Shape.registerMethod3(
  'LineY',
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge([0, begin, 0], [0, end, 0]));
    }
    return Group(edges);
  }
);

export const LineZ = Shape.registerMethod3(
  'LineZ',
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge([0, 0, begin], [0, 0, end]));
    }
    return Group(edges);
  }
);

export default Line;
