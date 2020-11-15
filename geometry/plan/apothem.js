export const apothem = (
  apothem = 1,
  { center = [0, 0, 0], sides = 32 } = {}
) => {
  return {
    type: 'apothem',
    center,
    apothem,
    sides,
  };
};
