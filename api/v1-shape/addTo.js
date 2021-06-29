import Shape from './Shape.js';
import { add } from './add.js';

export const addTo = (other) => (shape) => add(other, shape);
Shape.registerMethod('addTo', addTo);
