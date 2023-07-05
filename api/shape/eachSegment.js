import Group from './Group.js';
import Shape from './Shape.js';
import { toSegmentList as op } from '@jsxcad/geometry';

export const eachSegment = Shape.registerMethod3(
  'eachSegment',
  ['inputGeometry', 'function', 'function'],
  op,
  async (
    segments,
    [geometry, segmentOp = (segment) => (_shape) => segment, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const shapes = [];
    for (const segment of segments) {
      shapes.push(
        await Shape.apply(
          input,
          segmentOp,
          Shape.chain(Shape.fromGeometry(segment))
        )
      );
    }
    return Shape.apply(input, groupOp, ...shapes);
  }
);
