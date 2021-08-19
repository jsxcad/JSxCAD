import Shape from './Shape.js';
import { each } from './each.js';

export const nth = (n) => (shape) => each()(shape)[n];

export const n = nth;

Shape.registerMethod('nth', nth);
Shape.registerMethod('n', nth);
