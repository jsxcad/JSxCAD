import Shape from './Shape.js';
import { origin } from './origin.js';

export const to = Shape.chainable(
  (selection) => (shape) => shape.by(origin()).by(shape.toShape(selection))
);

Shape.registerMethod('to', to);
