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
      if (Shape.isShape(faceOp)) {
        console.log(`QQ/faces/faceOp/isChain: ${faceOp.isChain}`);
        const faceShape = faceOp;
        faceOp = (face) => (shape) => faceShape.to(face);
      }
      return eachEdge(
        (e, l, o) => e,
        async (e, f) => faceOp(f),
        groupOp
      )(shape);
    }
);

export default faces;
