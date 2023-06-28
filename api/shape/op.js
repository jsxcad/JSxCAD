import Group from './Group.js';
import Shape from './Shape.js';

export const op = Shape.registerMethod2(
  'op',
  ['input', 'functions'],
  async (input, functions = []) => {
    const results = [];
    for (const fun of functions) {
      const result = await fun(Shape.chain(input));
      results.push(result);
    }
    return Group(...results);
  }
);
