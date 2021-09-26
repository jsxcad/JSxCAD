export const taggedSurface = ({ tags = [] }, surface) => {
  return { type: 'surface', tags, surface };
};
