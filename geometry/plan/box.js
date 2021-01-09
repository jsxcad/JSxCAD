export const box = (length, width) => {
  return {
    type: 'box',
    _length: length,
    _width: width,
    _at: [0, 0, 0],
  };
};
