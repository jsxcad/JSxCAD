import Group from './Group.js';
import Shape from './Shape.js';
import { by } from './by.js';
import { destructure } from './destructure.js';
import { origin } from './origin.js';

export const to = Shape.registerMethod(
  'to',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions: references } = destructure(args);
      const arranged = [];
      for (const reference of await shape.toShapes(references)) {
        arranged.push(await by(origin()).by(reference)(shape));
      }
      return Group(...arranged);
    }
);
