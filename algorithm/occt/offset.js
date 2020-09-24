import { getOcct } from './occt.js';

// Note: This does not handle self-intersection properly.

export const offset = (paths, amount) => {
  const inputJson = JSON.stringify(paths);
  const outputJson = getOcct().offset(inputJson, amount);
  const offsetPaths = JSON.parse(outputJson);
  return offsetPaths;
};
