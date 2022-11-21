import Group from './Group.js';
import Shape from './Shape.js';
import { by } from './by.js';
import { origin } from './origin.js';

export const to = Shape.registerMethod(
  'to',
  (...references) =>
    async (shape) => {
      const arranged = [];
      console.log(`QQ/to/0`);
      for (const reference of await shape.toShapes(references)) {
        console.log(`QQ/to/1`);
        arranged.push(await by(origin()).by(reference)(shape));
        console.log(`QQ/to/2`);
      }
      return Group(...arranged);
    }
);
