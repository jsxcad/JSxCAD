export const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];

export const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

export const squaredLength = ([x = 0, y = 0, z = 0]) => x * x + y * y + z * z;

export const length = ([x = 0, y = 0, z = 0]) =>
  Math.sqrt(x * x + y * y + z * z);

export const max = ([ax, ay, az], [bx, by, bz]) => [
  Math.max(ax, bx),
  Math.max(ay, by),
  Math.max(az, bz),
];

export const min = ([ax, ay, az], [bx, by, bz]) => [
  Math.min(ax, bx),
  Math.min(ay, by),
  Math.min(az, bz),
];

export const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

export const subtract = (
  [ax = 0, ay = 0, az = 0],
  [bx = 0, by = 0, bz = 0]
) => [ax - bx, ay - by, az - bz];

export const distance = (a, b) => length(subtract(a, b));

export const cross = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ay * bz - az * by,
  az * bx - ax * bz,
  ax * by - ay * bx,
];

export const normalize = (a) => {
  const [x, y, z] = a;
  const len = x * x + y * y + z * z;
  if (len > 0) {
    // TODO: evaluate use of glm_invsqrt here?
    return scale(1 / Math.sqrt(len), a);
  } else {
    return a;
  }
};

export const equalsVector = (
  [aX = 0, aY = 0, aZ = 0] = [],
  [bX = 0, bY = 0, bZ = 0] = []
) => aX === bX && aY === bY && aZ === bZ;
