import { getOcct } from './occt.js';

export const offset = async (paths, amount) => {
  const oc = await getOcct();
  const inputJson = JSON.stringify(paths);
  const outputJson = oc.offset(inputJson, amount);
  const offsetPaths = JSON.parse(outputJson);
  return offsetPaths;
}
