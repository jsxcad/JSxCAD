import Shape from './Shape.js';
import { XY } from './refs.js';

export const flat = Shape.registerMethod(
  'flat',
  () => (shape) => shape.to(XY())
);
