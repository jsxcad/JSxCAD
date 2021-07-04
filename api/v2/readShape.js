import { Shape } from './Shape.js';
import { readFile } from '@jsxcad/sys';

export const readShape = async (path, { src } = {}) => {
  let data = await readFile({ doSerialize: false }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ sources: [src] }, `cache/${path}`);
  }
  return Shape.fromGeometry(await JSON.parse(data));
};

export default readShape;
