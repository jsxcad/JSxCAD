import {
  eachFaceEdges,
  taggedSegments,
  transformCoordinate,
} from '@jsxcad/geometry';
import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';

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

const SOURCE = 0;
const TARGET = 1;

export const eachEdge = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions, object: options = {} } = destructure(args);
  const { selections = [] } = options;
  let [edgeOp = (e, l) => e, faceOp = (e, f) => e, groupOp = Group] =
    shapesAndFunctions;
  if (edgeOp instanceof Shape) {
    const edgeShape = edgeOp;
    edgeOp = (edge) => edgeShape.to(edge);
  }
  const faces = [];
  eachFaceEdges(
    Shape.toShape(shape, shape).toGeometry(),
    shape.toShapes(selections).map((selection) => selection.toGeometry()),
    (faceGeometry, edgeGeometry) => {
      const { matrix, segments, normals } = edgeGeometry;
      const edges = [];
      if (segments) {
        for (let nth = 0; nth < segments.length; nth++) {
          const segment = segments[nth];
          const absoluteSegment = [
            transformCoordinate(segment[SOURCE], matrix),
            transformCoordinate(segment[TARGET], matrix),
          ];
          const absoluteNormal = normals
            ? subtract(
                transformCoordinate(normals[nth], matrix),
                absoluteSegment[SOURCE]
              )
            : [0, 0, 1];
          const inverse = fromSegmentToInverseTransform(
            absoluteSegment,
            absoluteNormal
          );
          const baseSegment = [
            transformCoordinate(absoluteSegment[SOURCE], inverse),
            transformCoordinate(absoluteSegment[TARGET], inverse),
          ];
          const inverseMatrix = invertTransform(inverse);
          // We get a pair of absolute coordinates from eachSegment.
          // We need a segment from [0,0,0] to [x,0,0] in its local space.
          edges.push(
            edgeOp(
              Shape.fromGeometry(
                taggedSegments({ matrix: inverseMatrix }, [baseSegment])
              ),
              length(segment[SOURCE], segment[TARGET])
            )
          );
        }
      }
      faces.push(faceOp(Group(...edges), Shape.fromGeometry(faceGeometry)));
    }
  );
  const grouped = groupOp(...faces);
  if (grouped instanceof Function) {
    return grouped(shape);
  } else {
    return grouped;
  }
});

Shape.registerMethod('eachEdge', eachEdge);