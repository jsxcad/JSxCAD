import Shape from './Shape.js';
import { toShape } from './toShape.js';

export const cutFrom = (other) => (shape) => toShape(other, shape).cut(shape);
Shape.registerMethod('cutFrom', cutFrom);
