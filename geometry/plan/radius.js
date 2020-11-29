export const radius = (radius = 1, { at = [0, 0, 0], sides = 32 } = {}) => {
  return {
    type: 'radius',
    at,
    radius,
    sides,
  };
};
