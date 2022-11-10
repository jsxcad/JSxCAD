import './eachEdge.js';

import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { destructure } from './destructure.js';

const eachEdgeOp = Shape.ops.get('eachEdge');

export const faces = Shape.registerMethod('faces', (...args) => async (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [faceOp = (face) => face, groupOp = Group] = shapesAndFunctions;
  if (Shape.isShape(faceOp)) {
    const faceShape = faceOp;
    faceOp = (face) => faceShape.to(face);
  }
  return eachEdgeOp(
    (e, l) => (s) => e,
    (e, f) => (s) => faceOp(f),
    groupOp
  )(shape);
});

export default faces;
