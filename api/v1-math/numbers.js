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

export const numbers = (thunk = (n => n), { from = 0, to, upto, by, resolution } = {}) => {
  const numbers = [];
  if (by === undefined) {
    if (resolution !== undefined) {
      by = to / resolution;
    } else {
      by = 1;
    }
  }

  if (to === undefined && upto === undefined) {
    upto = 1;
  }

  if (upto !== undefined) {
    // Exclusive
    for (let number = from; number < to - EPSILON; number += by) {
      numbers.push(thunk(number));
    }
  } else if (to !== undefined) {
    // Inclusive
    for (let number = from; number <= to + EPSILON; number += by) {
      numbers.push(thunk(number));
    }
  }
  return numbers;
};

export default numbers;

numbers.signature = 'numbers(spec) -> numbers';
