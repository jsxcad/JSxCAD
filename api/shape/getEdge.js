import { eachSegment, taggedSegments } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

const noOp = (shape) => shape;
const zero = (segment) => 0;

export const getEdge =
  (computeGoodness = zero, op = noOp) =>
  (shape) => {
    let best = [];
    let bestGoodness = 0;
    const admitSegment = (segment, orientation) => {
      const goodness = computeGoodness(segment);
      if (goodness < bestGoodness) {
        return;
      }
      if (goodness > bestGoodness) {
        bestGoodness = goodness;
        best.length = 0;
      }
      best.push({ segment, orientation });
    };
    eachSegment(shape.toGeometry(), admitSegment);
    return Group(
      ...best.map(({ segment, orientation }) =>
        op(Shape.fromGeometry(taggedSegments({ orientation }, [segment])))
      )
    );
  };

Shape.registerMethod('getEdge', getEdge);
