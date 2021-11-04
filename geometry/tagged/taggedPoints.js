export const taggedPoints = ({ tags = [], matrix }, points, exactPoints) => {
  return { type: 'points', tags, matrix, points, exactPoints };
};
