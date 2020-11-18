export const apothem = (apothem = 1, { at = [0, 0, 0], sides = 32 } = {}) => {
  return {
    type: 'apothem',
    at,
    apothem,
    sides,
  };
};
