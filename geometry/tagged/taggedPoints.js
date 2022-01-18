export const taggedPoints = ({ tags = [], matrix, provenance }, points, exactPoints) => {
  return { type: 'points', tags, matrix, provenance, points, exactPoints };
};
