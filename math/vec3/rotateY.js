export const rotateY = ([x, y, z], angle) => [
  z * Math.sin(angle) + x * Math.cos(angle),
  y,
  z * Math.cos(angle) - x * Math.sin(angle),
];
