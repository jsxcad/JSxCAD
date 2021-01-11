export const apothem = (apothem = 1, { at = [0, 0, 0], sides = 32 } = {}) => {
  return {
    type: 'apothem',
    _at: at,
    _apothem: apothem,
    _sides: sides,
  };
};
