import Empty from './Empty.js';
import Group from './Group.js';
import Shape from './Shape.js';

const EPSILON = 1e-5;

const maybeApply = (value, input) => {
  if (Shape.isFunction(value)) {
    return value(input);
  } else {
    return value;
  }
};

export const seq = Shape.registerMethod2(
  'seq',
  ['input', 'function', 'function', 'objects'],
  async (input, op = (n) => (s) => s, groupOp = Group, specs) => {
    const indexes = [];
    for (const spec of specs) {
      const { from = 0, to = 1, upto, downto, by = 1 } = spec;

      let consider;

      if (by > 0) {
        if (upto !== undefined) {
          consider = (value) => value < upto - EPSILON;
        } else {
          consider = (value) => value <= to + EPSILON;
        }
      } else if (by < 0) {
        if (downto !== undefined) {
          consider = (value) => value > downto + EPSILON;
        } else {
          consider = (value) => value >= to - EPSILON;
        }
      } else {
        throw Error('seq: Expects by != 0');
      }
      const numbers = [];
      for (let number = from, nth = 0; consider(number); number += by, nth++) {
        numbers.push(number);
      }
      indexes.push(numbers);
    }
    const results = [];
    const index = indexes.map(() => 0);
    for (;;) {
      const args = index.map((nth, index) => indexes[index][nth]);
      if (args.some((value) => value === undefined)) {
        break;
      }
      const result = await op(...args)(input);
      results.push(maybeApply(result, input));
      let nth;
      for (nth = 0; nth < index.length; nth++) {
        if (++index[nth] < indexes[nth].length) {
          break;
        }
        index[nth] = 0;
      }
      if (nth === index.length) {
        break;
      }
    }

    return groupOp(...results);
  }
);

export const Seq = Shape.registerMethod2(
  'Seq',
  ['input', 'rest'],
  (input = Empty(), rest) => input.seq(...rest)
);

export default Seq;
