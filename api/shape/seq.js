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
    let spec = {};
    for (const arg of args) {
      if (arg instanceof Function) {
        if (!op) {
          op = arg;
        } else if (!groupOp) {
          groupOp = arg;
        }
      } else if (arg instanceof Object) {
        Object.assign(spec, arg);
      }
    }
    if (!op) {
      op = (n) => n;
    }
    if (!groupOp) {
      groupOp = (...results) => results;
    }
    let { from = 0, to = 1, upto, downto, by = 1, index = false } = spec;

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

    const results = [];
    for (let number = from, nth = 0; consider(number); number += by, nth++) {
      results.push(
        index
          ? maybeApply(op(number, nth), shape)
          : maybeApply(op(number), shape)
      );
    }
    return groupOp(...results);
  };

Shape.registerMethod('seq', seq);
