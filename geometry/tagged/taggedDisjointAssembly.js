import { visit } from './visit.js';

export const taggedDisjointAssembly = ({ tags }, ...content) => {
  if (content.some((value) => !value)) {
    throw Error(`Undefined DisjointAssembly content`);
  }
  if (content.some((value) => value.length)) {
    throw Error(`DisjointAssembly content is an array`);
  }
  if (content.some((value) => value.geometry)) {
    throw Error(`Likely Shape instance in DisjointAssembly content`);
  }
  if (tags !== undefined && tags.length === undefined) {
    throw Error(`Bad tags`);
  }
  if (typeof tags === 'function') {
    throw Error(`Tags is a function`);
  }
  const disjointAssembly = { type: 'disjointAssembly', tags, content };
  visit(disjointAssembly, (geometry, descend) => {
    if (geometry.type === 'transform') {
      throw Error(
        `DisjointAssembly contains transform: ${JSON.stringify(geometry)}`
      );
    }
    return descend();
  });
  return disjointAssembly;
};
