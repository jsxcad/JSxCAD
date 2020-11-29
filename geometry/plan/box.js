export const box = (length, width) => {
  const at = [0, 0, 0];
  return {
    type: 'box',
    length,
    width,
    at,
  };
};
