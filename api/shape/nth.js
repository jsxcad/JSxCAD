import Group from './Group.js';
import Shape from './Shape.js';

export const nth = Shape.chainable((...ns) => (shape) => {
  const candidates = shape.each(
    (leaf) => leaf,
    (...leafs) =>
      (shape) =>
        leafs
  );
  return Group(...ns.map((n) => candidates[n]));
});

export const n = nth;

Shape.registerMethod('nth', nth);
Shape.registerMethod('n', nth);
