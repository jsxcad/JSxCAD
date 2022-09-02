import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { eachEdge } from './eachEdge.js';

export const faces = (...args) => {
  const { shapesAndFunctions } = destructure(args);
  let [faceOp = (face) => face, groupOp = Group] = shapesAndFunctions;
  if (faceOp instanceof Shape) {
    const faceShape = faceOp;
    faceOp = (face) => faceShape.to(face);
  }
  return eachEdge(
    (e, l) => e,
    (e, f) => faceOp(f),
    groupOp
  );
};

Shape.registerMethod('faces', faces);

export default faces;
