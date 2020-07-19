export const rotateZ = ([x, y, z], radians) => [
  x * Math.cos(radians) - y * Math.sin(radians),
  x * Math.sin(radians) + y * Math.cos(radians),
  z,
];
