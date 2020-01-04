export const rotateZ = ([x, y, z], angle) =>
  [x * Math.cos(angle) - y * Math.sin(angle),
   x * Math.sin(angle) + y * Math.cos(angle),
   z];
