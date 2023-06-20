import Group from './Group.js';
import Shape from './Shape.js';

export const copy = Shape.registerMethod2(
  'copy',
  ['input', 'number'],
  (input, count) => {
    const copies = [];
    for (let nth = 0; nth < count; nth++) {
      copies.push(input);
    }
    return Group(...copies);
  }
);
