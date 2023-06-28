// Determines the number of sides required for a circle of diameter such that deviation does not exceed tolerance.
// See: https://math.stackexchange.com/questions/4132060/compute-number-of-regular-polgy-sides-to-approximate-circle-to-defined-precision

// For ellipses, use the major diameter for a convervative result.

const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];
const subtract = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

export const toSidesFromZag = (diameter, tolerance = 1) => {
  const r = diameter / 2;
  const k = tolerance / r;
  const s = Math.ceil(Math.PI / Math.sqrt(k * 2));
  return s;
};

export const computeSides = (c1, c2, sides, zag = 0.01) => {
  if (sides) {
    return sides;
  }
  if (zag) {
    const diameter = Math.max(...abs(subtract(c1, c2)));
    return toSidesFromZag(diameter, zag);
  }
  return 32;
};

export const zagSides = (diameter = 1, zag = 0.01) =>
  toSidesFromZag(diameter, zag);

export const zagSteps = (diameter = 1, zag = 0.25) =>
  1 / toSidesFromZag(diameter, zag);
