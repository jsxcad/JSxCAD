export const fromAngleDegrees = (degrees) => {
  const radians = Math.PI * degrees / 180;
  return [Math.cos(radians), Math.sin(radians)];
};
