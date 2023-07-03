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
      shapes.push(await Shape.apply(input, segmentOp, Shape.chain(Shape.fromGeometry(segment))));
    }
    return Shape.apply(input, groupOp, ...shapes);
  }
);

/*
import { disorientSegment, linearize } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

export const eachSegment = Shape.registerMethod2(
  'eachSegment',
  ['input', 'function', 'function'],
  async (
    input,
    segmentOp = (segment) => (_shape) => segment,
    groupOp = Group
  ) => {
    const inputs = linearize(
      await input.toGeometry(),
      ({ type }) => type === 'segments'
    );
    const output = [];
    for (const { matrix, segments, normals } of inputs) {
      for (let nth = 0; nth < segments.length; nth++) {
        const [segment] = disorientSegment(
          segments[nth],
          matrix,
          normals ? normals[nth] : undefined
        );
        output.push(
          await segmentOp(Shape.chain(Shape.fromGeometry(segment)))(input)
        );
      }
    }
    const grouped = groupOp(...output);
    if (Shape.isFunction(grouped)) {
      return grouped(input);
    } else {
      return grouped;
    }
  }
);
*/
