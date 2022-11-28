import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
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

export const edges = Shape.registerMethod('edges', (...args) => async (shape) => {
  const { shapesAndFunctions, object: options = {} } = destructure(args);
  const { selections = [] } = options;
  let [edgesOp = (edges) => edges, groupOp = Group] = shapesAndFunctions;
  if (edgesOp instanceof Shape) {
    const edgesShape = edgesOp;
    edgesOp = (edges) => edgesShape.to(edges);
  }
  const edges = [];
  eachFaceEdges(
    await shape.toGeometry(),
    await shape.toShapesGeometries(selections),
    (faceGeometry, edgeGeometry) => {
      if (edgeGeometry) {
        edges.push(edgesOp(Shape.chain(Shape.fromGeometry(edgeGeometry))));
      }
    }
  );
  const grouped = groupOp(...edges);
  if (grouped instanceof Function) {
    return grouped(shape);
  } else {
    return grouped;
  }
});
