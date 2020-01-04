export const rotateX = ([x, y, z], angle) =>
  [x,
   y * Math.cos(angle) - z * Math.sin(angle),
   y * Math.sin(angle) + z * Math.cos(angle)];
