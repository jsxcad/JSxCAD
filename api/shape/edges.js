import Group from './Group.js';
import Shape from './Shape.js';
import { eachFaceEdges } from '@jsxcad/geometry';

// TODO: Add an option to include a virtual segment at the target of the last
// edge.

export const length = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

export const subtract = ([ax, ay, az], [bx, by, bz]) => [
  ax - bx,
  ay - by,
  az - bz,
];

export const edges = Shape.registerMethod2(
  'edges',
  ['input', 'function', 'function', 'geometries'],
  async (input, edgesOp = (edges) => edges, groupOp = Group, selections) => {
    const edges = [];
    eachFaceEdges(
      await input.toGeometry(),
      selections,
      (faceGeometry, edgeGeometry) => {
        if (edgeGeometry) {
          edges.push(edgesOp(Shape.chain(Shape.fromGeometry(edgeGeometry))));
        }
      }
    );
    const grouped = groupOp(...edges);
    if (grouped instanceof Function) {
      return grouped(input);
    } else {
      return grouped;
    }
  }
);
