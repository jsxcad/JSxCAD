export const taggedSegments = ({ tags = [] }, segments) => {
  return { type: 'segments', tags, segments };
};
