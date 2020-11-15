export const radius = (radius = 1, { center = [0, 0, 0], sides = 32 } = {}) => {
  return {
    type: 'radius',
    center,
    radius,
    sides,
  };
};
