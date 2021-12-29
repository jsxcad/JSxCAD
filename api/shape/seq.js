import Shape from './Shape.js';

const EPSILON = 1e-5;

export const seq =
  (...args) =>
  (shape) => {
    let op = (n) => n;
    let spec = {};
    for (const arg of args) {
      if (arg instanceof Function) {
        op = arg;
      } else if (arg instanceof Object) {
        Object.assign(spec, arg);
      }
    }
    let { from = 0, to = 1, upto, downto, by = 1, index = false } = spec;

    const numbers = [];

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

    for (let number = from, nth = 0; consider(number); number += by, nth++) {
      numbers.push(index ? op(number, nth) : op(number));
    }
    return numbers;
  };
