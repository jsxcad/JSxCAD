export const taggedSegments = (
  { tags = [], matrix, provenance, orientation },
  segments
) => {
  return { type: 'segments', tags, matrix, provenance, segments, orientation };
};
