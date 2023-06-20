import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { eachEdge } from './eachEdge.js';

export const faces = Shape.registerMethod2(
  'faces',
  ['input', 'function', 'function'],
  (input, faceOp = (face) => (shape) => face, groupOp = Group) => {
    return eachEdge(
      (e, l, o) => (s) => e,
      (e, f) => (s) => faceOp(f)(s),
      groupOp
    )(input);
  }
);

export default faces;
