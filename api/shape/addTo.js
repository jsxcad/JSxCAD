import Shape from './Shape.js';

export const addTo = Shape.chainable((other) => (shape) => other.add(shape));
Shape.registerMethod('addTo', addTo);
