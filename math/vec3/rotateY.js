export const rotateY = ([x, y, z], radians) => [
  z * Math.sin(radians) + x * Math.cos(radians),
  y,
  z * Math.cos(radians) - x * Math.sin(radians),
];
