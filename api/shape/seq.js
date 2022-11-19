import Empty from './Empty.js';
import Group from './Group.js';
import Shape from './Shape.js';
import { toValue } from './toValue.js';

const EPSILON = 1e-5;

const maybeApply = (value, shape) => {
  console.log(`QQ/maybeApply`);
  if (Shape.isFunction(value)) {
    return value(shape);
  } else {
    return value;
  }
};

// This is getting a bit excessively magical.
export const seq = Shape.registerMethod('seq', (...args) => async (shape) => {
  console.log(`QQ/seq/1`);
  let op;
  let groupOp;
  let specs = [];
  for (const arg of args) {
    if (Shape.isFunction(arg)) {
      if (!op) {
        op = arg;
        console.log(`QQ/op1`);
      } else if (!groupOp) {
        groupOp = arg;
      }
    } else if (Shape.isObject(arg)) {
      specs.push(arg);
    }
  }
  if (!op) {
    console.log(`QQ/op2`);
    op = (n) => (s) => n;
  }
  if (!groupOp) {
    groupOp = Group;
  }

  console.log(`QQ/seq/2`);
  const indexes = [];
  for (const spec of specs) {
    let { from = 0, to = 1, upto, downto, by = 1 } = spec;

    from = await toValue(from)(shape);
    to = await toValue(to)(shape);
    upto = await toValue(upto)(shape);
    downto = await toValue(downto)(shape);
    by = await toValue(by)(shape);

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
  console.log(`QQ/seq/3`);
  const results = [];
  const index = indexes.map(() => 0);
  for (;;) {
    console.log(`QQ/seq/3.1`);
    const args = index.map((nth, index) => indexes[index][nth]);
    if (args.some((value) => value === undefined)) {
      break;
    }
    console.log(`QQ/seq/3.2/args: ${JSON.stringify(args)}`);
    const pop = op(...args);
    console.log(`QQ/seq/3.2/pop: ${pop}`);
    const result = await op(...args)(shape);
    results.push(maybeApply(result, shape));
    console.log(`QQ/seq/3.3`);
    let nth;
    for (nth = 0; nth < index.length; nth++) {
      if (++index[nth] < indexes[nth].length) {
        break;
      }
      index[nth] = 0;
    }
    console.log(`QQ/seq/3.4`);
    if (nth === index.length) {
      break;
    }
  }
  console.log(`QQ/seq/4`);
  return groupOp(...results);
});

export const Seq = Shape.registerShapeMethod('Seq', (...args) =>
  Empty().seq(...args)
);

export default Seq;
