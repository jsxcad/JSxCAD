export const rotateX = ([x, y, z], radians) => [
  x,
  y * Math.cos(radians) - z * Math.sin(radians),
  y * Math.sin(radians) + z * Math.cos(radians),
];
