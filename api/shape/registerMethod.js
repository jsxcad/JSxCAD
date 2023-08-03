/*
import { Shape, chainable, ops } from './Shape.js';
import { endTime, getSourceLocation, startTime } from '@jsxcad/sys';

import { destructure2 } from './destructure.js';

export const registerMethod2 = (names, signature, baseOp) => {
  if (typeof names === 'string') {
    names = [names];
  }
  const path = getSourceLocation()?.path;

  const op =
    (...args) =>
    async (shape) => {
      const destructured = await destructure2(shape, args, ...signature);
      return baseOp(...destructured)(shape);
    };

  for (const name of names) {
    if (Shape.prototype.hasOwnProperty(name)) {
      const { origin } = Shape.prototype[name];
      if (origin !== path) {
        throw Error(
          `Method ${name} is already defined in ${origin} (this is ${path}).`
        );
      }
    }
    // Make the operation application available e.g., s.grow(1)
    // These methods work directly on unchained shapes, but don't compose when async.
    const { [name]: method } = {
      [name]: function (...args) {
        const timer = startTime(name);
        const result = op(...args)(this);
        endTime(timer);
        return result;
      },
    };
    method.origin = path;
    Shape.prototype[name] = method;

    ops.set(name, op);
  }
  return chainable(op);
};

// Shape.registerMethod2 = registerMethod2;
*/
