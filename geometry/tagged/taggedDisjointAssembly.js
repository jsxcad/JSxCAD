export const taggedDisjointAssembly = ({ tags }, ...content) => {
  if (content.some(value => !value)) {
    throw Error(`Undefined DisjointAssembly content`);
  }
  if (content.some(value => value.length)) {
    throw Error(`DisjointAssembly content is an array`);
  }
  if (content.some(value => value.geometry)) {
    throw Error(`Likely Shape instance in DisjointAssembly content`);
  }
  if (tags !== undefined && tags.length === undefined) {
    throw Error(`Bad tags`);
  }
  if (typeof tags === 'function') {
    throw Error(`Tags is a function`);
  }
  return { type: 'disjointAssembly', tags, content };
};
