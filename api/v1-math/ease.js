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

export const ease = (start = 0.0, end = 1.0, op = (t) => 1) => {
  const compose = (next = (t) => 1) => {
    const fn = (t) => {
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

export const linear = (start, end) => (t) => start + t * (end - start);
ease.linear = linear;

ease.signature =
  "ease(start:number = 0, end:number = 1, op:function) -> function";
linear.signature = "linear(start:number = 0, end:number = 1) -> function";

export default ease;
