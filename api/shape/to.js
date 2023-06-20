import Group from './Group.js';
import Shape from './Shape.js';
import { by } from './by.js';
import { origin } from './origin.js';

export const to = Shape.registerMethod2(
  'to',
  ['input', 'shapes'],
  async (input, references) => {
    const arranged = [];
    for (const reference of references) {
      arranged.push(await by(origin()(input)).by(reference)(input));
    }
    return Group(...arranged);
  }
);
