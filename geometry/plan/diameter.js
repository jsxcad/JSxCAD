export const diameter = (
  diameter = 1,
  { center = [0, 0, 0], sides = 32 } = {}
) => {
  return {
    type: 'diameter',
    center,
    diameter,
    sides,
  };
};
