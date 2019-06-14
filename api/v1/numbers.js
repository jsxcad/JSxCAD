/**
 *
 * # Numbers
 *
 * ```
 * numbers({ to: 10 }) is [0, 1, 2, 3, 4, 5, 6, 9].
 * numbers({ from: 3, to: 6 }) is [3, 4, 5, 6].
 * numbers({ from: 2, to: 8, by: 2 }) is [2, 4, 6].
 * ```
 *
 **/

export const numbers = ({ from = 0, to = 0, by = 1 }) => {
  const numbers = [];
  for (let number = from; number < to; number += by) {
    numbers.push(number);
  }
  return numbers;
}
