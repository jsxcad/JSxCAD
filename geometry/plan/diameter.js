export const diameter = (diameter = 1, { at = [0, 0, 0], sides = 32 } = {}) => {
  return {
    type: 'diameter',
    at,
    diameter,
    sides,
  };
};
