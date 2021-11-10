export const taggedSegments = (
  { tags = [], matrix, orientation },
  segments
) => {
  return { type: 'segments', tags, matrix, segments, orientation };
};
