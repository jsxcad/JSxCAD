import Group from './Group.js';
import Shape from './Shape.js';
import { clip } from './clip.js';
import { cut } from './cut.js';
import { destructure } from './destructure.js';

export const cutOut = Shape.registerMethod(
  'cutOut',
  (...args) =>
    async (shape) => {
      const {
        shapesAndFunctions: others,
        functions,
        strings: modes,
      } = destructure(args);
      const [
        cutOp = (shape) => shape,
        clipOp = (shape) => shape,
        groupOp = Group,
      ] = functions;
      const other = shape.toShape(others[0]);
      return groupOp(
        await cut(other, ...modes).op(cutOp)(shape),
        await clip(other, ...modes).op(clipOp)(shape)
      );
    }
);
