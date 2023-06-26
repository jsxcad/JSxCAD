import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { eachEdge } from './eachEdge.js';

export const faces = Shape.registerMethod2(
  'faces',
  ['input', 'function', 'function'],
  (input, faceOp = (face) => (_shape) => face, groupOp = Group) => {
    return eachEdge(
      (e, _l, _o) => (_s) => e,
      (_e, f) => faceOp(f),
      groupOp
    )(input);
  }
);

export default faces;
