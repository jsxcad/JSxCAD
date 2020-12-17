export const taggedTransform = (options = {}, matrix, untransformed) => {
  return {
    type: 'transform',
    matrix,
    content: [untransformed],
    tags: untransformed.tags,
  };
};
