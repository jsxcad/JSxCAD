export const taggedPoints = ({ tags = [] }, points, exactPoints) => {
  return { type: 'points', tags, points, exactPoints };
};
