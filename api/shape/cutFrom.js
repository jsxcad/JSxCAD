import Shape from './Shape.js';
import { cut } from './cut.js';

export const cutFrom = Shape.registerMethod2(
  'cutFrom',
  ['input', 'shape', 'modes:open,exact,noVoid,noGhost'],
  (input, other, modes) => cut(input, ...modes)(other)
);
