export const taggedSegments = ({ tags = [], matrix }, segments) => {
  return { type: 'segments', tags, matrix, segments };
};
