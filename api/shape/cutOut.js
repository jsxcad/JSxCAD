import Group from './Group.js';
import Shape from './Shape.js';
import { clip } from './clip.js';
import { cut } from './cut.js';
import { destructure2 } from './destructure.js';
import { op } from './op.js';

export const cutOut = Shape.registerMethod(
  'cutOut',
  (...args) =>
    async (shape) => {
      const [other, cutOp = (shape) => shape, clipOp = (shape) => shape, groupOp = Group, modes] = await destructure2(shape, args, 'shape', 'function', 'function', 'function', 'modes');
      const cutShape = await cut(other, ...modes, 'noGhost')(shape);
      const clipShape = await clip(other, ...modes, 'noGhost')(shape);
      return groupOp(await op(cutOp)(cutShape), await op(clipOp)(clipShape));
    }
);
