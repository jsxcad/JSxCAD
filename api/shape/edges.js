import Group from './Group.js';
import Shape from './Shape.js';
import { toOrientedFaceEdgesList as op } from '@jsxcad/geometry';

export const edges = Shape.registerMethod3(
  'edges',
  ['inputGeometry', 'function', 'function'],
  op,
  async (
    faceEdgesList,
    [geometry, edgesOp = (edges) => (_shape) => edges, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const shapes = [];
    for (const { edges } of faceEdgesList) {
      shapes.push(
        await Shape.apply(
          input,
          edgesOp,
          ...edges.map(({ segment }) => Shape.fromGeometry(segment))
        )
      );
    }
    return Shape.apply(input, groupOp, ...shapes);
  }
);

export default edges;

/*
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
  ['input', 'geometries', 'function', 'function'],
  async (input, selections, edgesOp = (edges) => edges, groupOp = Group) => {
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
*/
