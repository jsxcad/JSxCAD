import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';

export const cutOut = Shape.chainable((...args) => (shape) => {
  const {
    shapesAndFunctions: others,
    functions,
    strings: modes,
  } = destructure(args);
  const [cutOp = (shape) => shape, clipOp = (shape) => shape, groupOp = Group] =
    functions;
  const other = shape.toShape(others[0]);
  return groupOp(
    shape.cut(other, ...modes).op(cutOp),
    shape.clip(other, ...modes).op(clipOp)
  );
});
Shape.registerMethod('cutOut', cutOut);
