export const taggedLayout = ({ tags, size, margin, title, marks = [] }, ...content) => {
  if (content.some(value => value === undefined)) {
    throw Error(`Undefined Layout content`);
  }
  if (content.some(value => value.length)) {
    throw Error(`Layout content is an array`);
  }
  if (content.some(value => value.geometry)) {
    throw Error(`Likely Shape in Layout`);
  }
  return { type: 'layout', layout: { size, margin, title }, marks, tags, content };
};
