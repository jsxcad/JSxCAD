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

var Prando = /** @class */ (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    /**
     * Generate a new Prando pseudo-random number generator.
     *
     * @param seed - A number or string seed that determines which pseudo-random number sequence will be created. Defaults to current time.
     */
    function Prando(seed) {
        this._value = NaN;
        if (typeof (seed) === "string") {
            // String seed
            this._seed = this.hashCode(seed);
        }
        else if (typeof (seed) === "number") {
            // Numeric seed
            this._seed = this.getSafeSeed(seed);
        }
        else {
            // Pseudo-random seed
            this._seed = this.getSafeSeed(Prando.MIN + Math.floor((Prando.MAX - Prando.MIN) * Math.random()));
        }
        this.reset();
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    /**
     * Generates a pseudo-random number between a lower (inclusive) and a higher (exclusive) bounds.
     *
     * @param min - The minimum number that can be randomly generated.
     * @param pseudoMax - The maximum number that can be randomly generated (exclusive).
     * @return The generated pseudo-random number.
     */
    Prando.prototype.next = function (min, pseudoMax) {
        if (min === void 0) { min = 0; }
        if (pseudoMax === void 0) { pseudoMax = 1; }
        this.recalculate();
        return this.map(this._value, Prando.MIN, Prando.MAX, min, pseudoMax);
    };
    /**
     * Generates a pseudo-random integer number in a range (inclusive).
     *
     * @param min - The minimum number that can be randomly generated.
     * @param max - The maximum number that can be randomly generated.
     * @return The generated pseudo-random number.
     */
    Prando.prototype.nextInt = function (min, max) {
        if (min === void 0) { min = 10; }
        if (max === void 0) { max = 100; }
        this.recalculate();
        return Math.floor(this.map(this._value, Prando.MIN, Prando.MAX, min, max + 1));
    };
    /**
     * Generates a pseudo-random string sequence of a particular length from a specific character range.
     *
     * Note: keep in mind that creating a random string sequence does not guarantee uniqueness; there is always a
     * 1 in (char_length^string_length) chance of collision. For real unique string ids, always check for
     * pre-existing ids, or employ a robust GUID/UUID generator.
     *
     * @param length - Length of the strting to be generated.
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated string sequence.
     */
    Prando.prototype.nextString = function (length, chars) {
        if (length === void 0) { length = 16; }
        if (chars === void 0) { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; }
        var str = "";
        while (str.length < length) {
            str += this.nextChar(chars);
        }
        return str;
    };
    /**
     * Generates a pseudo-random string of 1 character specific character range.
     *
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated character.
     */
    Prando.prototype.nextChar = function (chars) {
        if (chars === void 0) { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; }
        this.recalculate();
        return chars.substr(this.nextInt(0, chars.length - 1), 1);
    };
    /**
     * Picks a pseudo-random item from an array. The array is left unmodified.
     *
     * Note: keep in mind that while the returned item will be random enough, picking one item from the array at a time
     * does not guarantee nor imply that a sequence of random non-repeating items will be picked. If you want to
     * *pick items in a random order* from an array, instead of *pick one random item from an array*, it's best to
     * apply a *shuffle* transformation to the array instead, then read it linearly.
     *
     * @param array - Array of any type containing one or more candidates for random picking.
     * @return An item from the array.
     */
    Prando.prototype.nextArrayItem = function (array) {
        this.recalculate();
        return array[this.nextInt(0, array.length - 1)];
    };
    /**
     * Generates a pseudo-random boolean.
     *
     * @return A value of true or false.
     */
    Prando.prototype.nextBoolean = function () {
        this.recalculate();
        return this._value > 0.5;
    };
    /**
     * Skips ahead in the sequence of numbers that are being generated. This is equivalent to
     * calling next() a specified number of times, but faster since it doesn't need to map the
     * new random numbers to a range and return it.
     *
     * @param iterations - The number of items to skip ahead.
     */
    Prando.prototype.skip = function (iterations) {
        if (iterations === void 0) { iterations = 1; }
        while (iterations-- > 0) {
            this.recalculate();
        }
    };
    /**
     * Reset the pseudo-random number sequence back to its starting seed. Further calls to next()
     * will then produce the same sequence of numbers it had produced before. This is equivalent to
     * creating a new Prando instance with the same seed as another Prando instance.
     *
     * Example:
     * let rng = new Prando(12345678);
     * console.log(rng.next()); // 0.6177754114889017
     * console.log(rng.next()); // 0.5784605181725837
     * rng.reset();
     * console.log(rng.next()); // 0.6177754114889017 again
     * console.log(rng.next()); // 0.5784605181725837 again
     */
    Prando.prototype.reset = function () {
        this._value = this._seed;
    };
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    Prando.prototype.recalculate = function () {
        this._value = this.xorshift(this._value);
    };
    Prando.prototype.xorshift = function (value) {
        // Xorshift*32
        // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
        value ^= value << 13;
        value ^= value >> 17;
        value ^= value << 5;
        return value;
    };
    Prando.prototype.map = function (val, minFrom, maxFrom, minTo, maxTo) {
        return ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
    };
    Prando.prototype.hashCode = function (str) {
        var hash = 0;
        if (str) {
            var l = str.length;
            for (var i = 0; i < l; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
                hash = this.xorshift(hash);
            }
        }
        return this.getSafeSeed(hash);
    };
    Prando.prototype.getSafeSeed = function (seed) {
        if (seed === 0)
            return 1;
        return seed;
    };
    Prando.MIN = -2147483648; // Int32 min
    Prando.MAX = 2147483647; // Int32 max
    return Prando;
}());

const makeTo = (g) => (to) => g() * to;
const makeIn = (g) => (from, to) => g() * (to - from) + from;
const makeVary = (g) => (degree) => (g() - 0.5) * degree * 2;
const makePick = (g) => (options) => options[Math.floor(g() * options.length)];

const Random = (seed = 0) => {
  const rng = new Prando(seed);
  const g = () => rng.next();
  g.in = makeIn(g);
  g.to = makeTo(g);
  g.vary = makeVary(g);
  g.pick = makePick(g);
  return g;
};

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
    for (let number = from, nth = 0; number < to - EPSILON; number += by, nth++) {
      numbers.push(thunk(number, nth));
    }
  } else if (to !== undefined) {
    // Inclusive
    for (let number = from, nth = 0; number <= to + EPSILON; number += by, nth++) {
      numbers.push(thunk(number, nth));
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
  Random,
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
export { Random, acos, cos, ease, linear, max, min, numbers, sin, sqrt };
