import { getLeafs } from './tagged/getLeafs.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { replacer } from './tagged/visit.js';
import { transform } from './transform.js';

// We split on into two phases to allow arbitrary operations to occur inbetween.

export const onPre = (geometry, selection) => {
  const results = [];
  for (const inputLeaf of getLeafs(selection)) {
    const global = inputLeaf.matrix;
    const local = invertTransform(global);
    // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
    const localInputLeaf = transform(inputLeaf, local);
    results.push({ inputLeaf, localInputLeaf, global });
  }
  return results;
};

export const onPost = (geometry, results) => {
  const inputLeafs = [];
  const outputLeafs = [];
  for (const { inputLeaf, localOutputLeaf, global } of results) {
    inputLeafs.push(inputLeaf);
    outputLeafs.push(transform(localOutputLeaf, global));
  }
  return replacer(inputLeafs, outputLeafs)(geometry);
};

export const on = (geometry, selection, op = (g) => g) => {
  const results = [];
  for (const { inputLeaf, localInputLeaf, global } of onPre(
    geometry,
    selection
  )) {
    const localOutputLeaf = op(localInputLeaf);
    results.push({ inputLeaf, localOutputLeaf, global });
  }
  return onPost(geometry, results);
};
