import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { toFaceEdgesList as op } from '@jsxcad/geometry';

export const faces = Shape.registerMethod3(
  'faces',
  ['inputGeometry', 'options', 'function', 'function'],
  op,
  async (
    faceEdgesList,
    [geometry, _options, faceOp = (face) => (_s) => face, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const results = [];
    for (const { face } of faceEdgesList) {
      const faceShape = await Shape.apply(
        input,
        faceOp,
        Shape.chain(Shape.fromGeometry(face))
      );
      results.push(faceShape);
    }
    return Shape.apply(input, groupOp, ...results);
  }
);

export default faces;
