import Group from './Group.js';
import Shape from './Shape.js';
import { toOrientedFaceEdgesList as op } from '@jsxcad/geometry';

export const eachEdge = Shape.registerMethod3(
  'eachEdge',
  [
    'inputGeometry',
    'function',
    'function',
    'function',
    'options:select=geometries',
  ],
  op,
  async (
    faceEdgesList,
    [
      geometry,
      edgeOp = (e, _l, _o) => (_s) => e,
      faceOp = (es, _f) => (_s) => es,
      groupOp = Group,
    ]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const resultShapes = [];
    for (const { face, edges } of faceEdgesList) {
      const edgeShapes = [];
      for (const { segment, length, backward } of edges) {
        edgeShapes.push(
          await Shape.apply(
            input,
            edgeOp,
            Shape.chain(Shape.fromGeometry(segment)),
            length,
            Shape.chain(Shape.fromGeometry(backward))
          )
        );
      }
      const resultShape = await Shape.apply(
        input,
        faceOp,
        Group(...edgeShapes),
        Shape.chain(Shape.fromGeometry(face))
      );
      resultShapes.push(resultShape);
    }
    return Shape.apply(input, groupOp, ...resultShapes);
  }
);
