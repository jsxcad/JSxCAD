import { Shape } from './Shape.js';
import { clip } from './clip.js';

export const clipFrom = (other) => (shape) => clip(other, shape);
Shape.registerMethod('clipFrom', clipFrom);
