import './eachEdge.js';

import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { eachEdge } from './eachEdge.js';

// const eachEdge = Shape.ops.get('eachEdge');

export const faces = Shape.registerMethod('faces', (...args) => async (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [faceOp = (face) => (s) => face, groupOp = Group] = shapesAndFunctions;
  if (Shape.isShape(faceOp)) {
    const faceShape = faceOp;
    faceOp = (face) => (s) => faceShape.to(face);
  }
  return eachEdge(
    (e, l, o) => (s) => e,
    (e, f) => (s) => faceOp(f)(s),
    groupOp
  )(shape);
});

export default faces;
