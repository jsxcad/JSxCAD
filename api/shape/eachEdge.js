import {
  eachSegment,
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

export const eachEdge = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [leafOp = (edge) => edge, groupOp = Group] = shapesAndFunctions;
  if (leafOp instanceof Shape) {
    const leafShape = leafOp;
    leafOp = (edge) => leafShape.to(edge);
  }
  const leafs = [];
  eachSegment(Shape.toShape(shape, shape).toGeometry(), (segment) => {
    const inverse = fromSegmentToInverseTransform(segment);
    const baseSegment = [
      transformCoordinate(segment[0], inverse),
      transformCoordinate(segment[1], inverse),
    ];
    const matrix = invertTransform(inverse);
    // We get a pair of absolute coordinates from eachSegment.
    // We need a segment from [0,0,0] to [x,0,0] in its local space.
    leafs.push(
      leafOp(
        Shape.fromGeometry(taggedSegments({ matrix }, [baseSegment])),
        length(segment[0], segment[1])
      )
    );
  });
  const grouped = groupOp(...leafs);
  if (grouped instanceof Function) {
    return grouped(shape);
  } else {
    return grouped;
  }
});

Shape.registerMethod('eachEdge', eachEdge);
