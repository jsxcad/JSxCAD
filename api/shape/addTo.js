import Shape from './Shape.js';

export const addTo = (other) => (shape) => other.add(shape);
Shape.registerMethod('addTo', addTo);
