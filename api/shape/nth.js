import Group from './Group.js';
import Shape from './Shape.js';

export const nth =
  (...ns) =>
  (shape) => {
    const candidates = shape.each(leaf => leaf, leafs => leafs);
    return Group(...ns.map((n) => candidates[n]));
  };

export const n = nth;

Shape.registerMethod('nth', nth);
Shape.registerMethod('n', nth);
