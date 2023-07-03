export const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];

export const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

export const length = ([x = 0, y = 0, z = 0]) =>
  Math.sqrt(x * x + y * y + z * z);

export const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

export const subtract = ([ax, ay, az], [bx, by, bz]) => [
  ax - bx,
  ay - by,
  az - bz,
];

export const distance = (a, b) => length(subtract(a, b));
