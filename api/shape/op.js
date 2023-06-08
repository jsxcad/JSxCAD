import Shape from './Shape.js';

export const op = Shape.registerMethod2(
  'op',
  ['input', 'functions'],
  async (input, functions = []) => {
    for (const fun of functions) {
      input = await fun(input);
    }
    return input;
  }
);
