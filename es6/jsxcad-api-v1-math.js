import * as vec from './jsxcad-math-vec3.js';
export { vec };

/**
 *
 * # Ease
 *
 * Produces a function for composing easing functions.
 * ```
 * ease(0.00, 0.25, t => sin(t * 25))(ease(0.25, 1.00, t => 5)())
 * ```
 *
 **/

const ease = (start = 0.00, end = 1.00, op = t => 1) => {
  const compose = (next = t => 1) => {
    const fn = t => {
      if (t >= start && t <= end) {
        return op((t - start) / (end - start));
      } else {
        return next(t);
      }
    };
    return fn;
  };
  return compose;
};

const linear = (start, end) => t => start + t * (end - start);
ease.linear = linear;

ease.signature = 'ease(start:number = 0, end:number = 1, op:function) -> function';
linear.signature = 'linear(start:number = 0, end:number = 1) -> function';

/**
 *
 * # Arc Cosine
 *
 * Gives the arc cosine converted to degrees.
 * ```
 * acos(a) => Math.acos(a) / (Math.PI * 2) * 360;
 *
 * acos(0) = 90
 * acos(0.5) = 60
 * acos(1) = 0
 * ```
 *
 **/

const acos = (a) => Math.acos(a) / (Math.PI * 2) * 360;
acos.signature = 'acos(angle:number) -> number';

/**
 *
 * # Cosine
 *
 * Gives the cosine in degrees.
 * ```
 * cos(a) => Math.cos(a / 360 * Math.PI * 2);
 *
 * cos(0) = 1
 * cos(45) = 0.707
 * cos(90) = 0
 * ```
 *
 **/

const cos = (a) => Math.cos(a / 360 * Math.PI * 2);

cos.signature = 'cos(angle:number) -> number';

/**
 *
 * # Max
 *
 * Produces the maximum of a series of numbers.
 *
 * ```
 * max(1, 2, 3, 4) == 4
 * ```
 *
 **/

const max = Math.max;

max.signature = 'max(...values:number) -> number';

/**
 *
 * # Min
 *
 * Produces the minimum of a series of numbers.
 *
 * ```
 * min(1, 2, 3, 4) == 1
 * ```
 *
 **/

const min = Math.min;

min.signature = 'min(...values:number) -> number';

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

const numbers = (thunk = (n => n), { from = 0, to, upto, by, resolution } = {}) => {
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

numbers.signature = 'numbers(spec) -> numbers';

/**
 *
 * # Sine
 *
 * Gives the sine in degrees.
 * ```
 * sin(a) => Math.sin(a / 360 * Math.PI * 2);
 *
 * sin(0) = 0
 * sin(45) = 0.707
 * sin(90) = 1
 * ```
 *
 **/

const sin = (a) => Math.sin(a / 360 * Math.PI * 2);

/**
 *
 * # Square Root
 *
 * Gives the the square root of a number.
 * ```
 * sqrt(a) => Math.sqrt(a);
 *
 * sqrt(0) = 0
 * sqrt(4) = 2
 * sqrt(16) = 4
 * ```
 *
 **/

const sqrt = Math.sqrt;

const api = {
  acos,
  cos,
  ease,
  linear,
  max,
  min,
  numbers,
  sin,
  sqrt,
  vec
};

export default api;
export { acos, cos, ease, linear, max, min, numbers, sin, sqrt };
