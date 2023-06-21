import Group from './Group.js';
import Shape from './Shape.js';
import { clip } from './clip.js';
import { cut } from './cut.js';
import { op } from './op.js';

export const cutOut = Shape.registerMethod2(
  'cutOut',
  [
    'input',
    'shape',
    'function',
    'function',
    'function',
    'modes:open,exact,noGhost,noVoid',
  ],
  async (
    input,
    other,
    cutOp = (shape) => shape,
    clipOp = (shape) => shape,
    groupOp = Group,
    modes
  ) => {
    const cutShape = await cut(other, ...modes, 'noGhost')(input);
    const clipShape = await clip(other, ...modes, 'noGhost')(input);
    return groupOp(await op(cutOp)(cutShape), await op(clipOp)(clipShape));
  }
);
