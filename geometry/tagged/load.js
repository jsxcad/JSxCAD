import { read } from '@jsxcad/sys';

export const load = async (geometry) => {
  if (geometry.is_loaded) {
    return geometry;
  }
  if (!geometry.hash) {
    return;
  }
  geometry = await read(`hash/${geometry.hash}`);
  if (!geometry) {
    return;
  }
  if (geometry.is_loaded) {
    return geometry;
  }
  geometry.is_loaded = true;
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      geometry.content[nth] = await load(geometry.content[nth]);
    }
  }
  return geometry;
};
