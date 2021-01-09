export const radius = (radius = 1, { at = [0, 0, 0], sides = 32 } = {}) => {
  return {
    type: 'radius',
    _at: at,
    _radius: radius,
    _sides: sides,
  };
};
