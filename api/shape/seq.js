import Shape from './Shape.js';

const EPSILON = 1e-5;

const maybeApply = (value, shape) => {
  if (value instanceof Function) {
    return value(shape);
  } else {
    return value;
  }
};

// This is getting a bit excessively magical.
export const seq =
  (...args) =>
  (shape) => {
    let op;
    let groupOp;
    let specs = [];
    for (const arg of args) {
      if (arg instanceof Function) {
        if (!op) {
          op = arg;
        } else if (!groupOp) {
          groupOp = arg;
        }
      } else if (arg instanceof Object) {
        specs.push(arg);
      }
    }
    if (!op) {
      op = (n) => n;
    }
    if (!groupOp) {
      groupOp = (...values) => values;
    }

    const indexes = [];
    for (const spec of specs) {
      let { from = 0, to = 1, upto, downto, by = 1 } = spec;

      from = Shape.toValue(from, shape);
      to = Shape.toValue(to, shape);
      upto = Shape.toValue(upto, shape);
      downto = Shape.toValue(downto, shape);
      by = Shape.toValue(by, shape);

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
      results.push(
        maybeApply(op(...index.map((nth, index) => indexes[index][nth])), shape)
      );
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
  };

Shape.registerMethod('seq', seq);
