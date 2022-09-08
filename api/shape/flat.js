import Shape from './Shape.js';
import { XY } from './refs.js';

export const flat = Shape.chainable(() => (shape) => shape.to(XY()));

Shape.registerMethod('flat', flat);
