// Determines the number of sides required for a circle of diameter such that deviation does not exceed tolerance.
// See: https://math.stackexchange.com/questions/4132060/compute-number-of-regular-polgy-sides-to-approximate-circle-to-defined-precision

// For ellipses, use the major diameter for a convervative result.

export const zag = (diameter, tolerance = 1) => {
  const r = diameter / 2;
  const k = tolerance / r;
  const s = Math.ceil(Math.PI / Math.sqrt(k * 2));
  return s;
};

export default zag;
