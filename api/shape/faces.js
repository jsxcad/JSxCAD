import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { eachEdge } from './eachEdge.js';

export const faces = Shape.registerMethod2(
  'faces',
  ['input', 'function', 'function'],
  (input, faceOp = (face) => (shape) => face, groupOp = Group) =>
    eachEdge(
      (e, l, o) => (s) => e,
      (e, f) => (s) => faceOp(f),
      groupOp
    )(input)
);

export default faces;
