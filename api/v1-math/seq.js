/**
 *
 * # Numbers
 *
 * ```
 * numbers({ to: 10 }) is [0, 1, 2, 3, 4, 5, 6, 9].
 * numbers({ from: 3, to: 6 }) is [3, 4, 5, 6].
 * numbers({ from: 2, to: 8, by: 2 }) is [2, 4, 6].
 * numbers({ to: 2 }, { to: 3 }) is [[0, 0], [0, 1], [0, 2], [1, 0], ...];
 * ```
 *
 **/

const EPSILON = 1e-5;

export const seq = (
  op = (n) => n,
  { from = 0, to = 1, upto, downto, by = 1, index = false } = {}
) => {
  const numbers = [];

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
