import { disorientSegment, linearize } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

export const eachSegment = Shape.registerMethod(
  'eachSegment',
  (...args) =>
    async (shape) => {
      const [segmentOp = (segment) => (shape) => segment, groupOp = Group] =
        await destructure2(shape, args, 'function', 'function');
      const inputs = linearize(
        await shape.toGeometry(),
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
            await segmentOp(Shape.chain(Shape.fromGeometry(segment)))(shape)
          );
        }
      }
      const grouped = groupOp(...output);
      if (Shape.isFunction(grouped)) {
        return grouped(shape);
      } else {
        return grouped;
      }
    }
);
