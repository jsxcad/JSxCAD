export const taggedDisplayGeometry = ({ tags }, ...content) => {
  if (content.some((value) => value === undefined)) {
    throw Error(`Undefined DisplayGeometry content`);
  }
  if (content.length !== 1) {
    throw Error(`DisplayGeometry expects a single content geometry`);
  }
  return { type: 'displayGeometry', tags, content };
};
