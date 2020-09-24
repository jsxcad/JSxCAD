export const taggedGroup = ({ tags }, ...content) => {
  if (content.some((value) => !value)) {
    throw Error(`Undefined Group content`);
  }
  if (content.some((value) => value.length)) {
    throw Error(`Group content is an array`);
  }
  // FIX: Deprecate layers.
  return { type: 'layers', tags, content };
};
