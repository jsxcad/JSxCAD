import { Shape } from './Shape.js';

export const clipFrom = (other) => (shape) => other.clip(shape);
Shape.registerMethod('clipFrom', clipFrom);
