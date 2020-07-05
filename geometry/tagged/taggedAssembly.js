export const taggedAssembly = ({ tags }, ...content) => {
  if (content.some((value) => !value)) {
    throw Error(`Undefined Assembly content`);
  }
  if (content.some((value) => value.length)) {
    throw Error(`Assembly content is an array`);
  }
  if (content.some((value) => value.geometry)) {
    throw Error(`Likely Shape instance in Assembly content`);
  }
  if (tags !== undefined && tags.length === undefined) {
    throw Error(`Bad tags`);
  }
  if (typeof tags === 'function') {
    throw Error(`Tags is a function`);
  }
  return { type: 'assembly', tags, content };
};
