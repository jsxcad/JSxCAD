import { Shape } from './Shape.js';

export const clipfrom = (other) => (shape) => other.clip(shape);
Shape.registerMethod('clipFrom', clipfrom);
