import { eachSegment, taggedSegments } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';

export const edges =
  (...args) =>
  (shape) => {
    const { functions } = destructure(args);
    const [leafOp = (l) => l, groupOp = (g) => (s) => Group(...g)] = functions;
    const leafs = [];
    eachSegment(Shape.toShape(shape, shape).toGeometry(), (segment) =>
      leafs.push(leafOp(Shape.fromGeometry(taggedSegments({}, [segment]))))
    );
    const grouped = groupOp(leafs);
    if (grouped instanceof Function) {
      return grouped(shape);
    } else {
      return grouped;
    }
  };

Shape.registerMethod('edges', edges);
