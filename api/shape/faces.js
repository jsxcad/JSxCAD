import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { eachEdge } from './eachEdge.js';

export const faces = Shape.registerMethod(
  'faces',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions } = destructure(args);
      let [faceOp = (face) => (shape) => face, groupOp = Group] =
        shapesAndFunctions;
      return eachEdge(
        (e, l, o) => (s) => e,
        (e, f) => (s) => faceOp(f),
        groupOp
      )(shape);
    }
);

export default faces;
