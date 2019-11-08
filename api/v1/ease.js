export const ease = (start = 0.00, end = 1.00, op = t => 1) => {
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

export const linear = (start, end) => t => start + t * (end - start);

ease.linear = linear;
