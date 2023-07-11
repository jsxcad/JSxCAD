import { Empty, seq as computeSequence } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

const toShapesFromSequence = async (
  geometry,
  op = (_n) => (s) => s,
  groupOp = Group,
  specs
) => {
  const input = Shape.fromGeometry(geometry);
  const results = [];
  for (const coordinate of computeSequence(...specs)) {
    results.push(await Shape.apply(input, op, ...coordinate));
  }
  return Shape.apply(input, groupOp, ...results);
};

export const seq = Shape.registerMethod3(
  'seq',
  ['inputGeometry', 'function', 'function', 'objects'],
  toShapesFromSequence,
  (shape) => shape
);

export const Seq = Shape.registerMethod3(
  'Seq',
  ['function', 'function', 'objects'],
  (op = (_n) => (s) => s, groupOp = Group, specs) =>
    toShapesFromSequence(Empty(), op, groupOp, specs),
  (shape) => shape
);

export default Seq;
