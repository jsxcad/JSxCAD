export const taggedToolpath = ({ tags = [], provenance }, toolpath) => {
  return { type: 'toolpath', tags, toolpath };
};
