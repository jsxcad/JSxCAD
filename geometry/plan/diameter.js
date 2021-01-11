export const diameter = (diameter = 1, { at = [0, 0, 0], sides = 32 } = {}) => {
  return {
    type: 'diameter',
    _at: at,
    _diameter: diameter,
    _sides: sides,
  };
};
