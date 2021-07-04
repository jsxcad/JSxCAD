import Shape from '@jsxcad/api-v2';
import { fromObj } from '@jsxcad/convert-obj';
import { read } from '@jsxcad/sys';

export const readObj = async (path, { src, invert = false } = {}) => {
  const data = await read(`source/${path}`, { sources: [path] });
  return Shape.fromGeometry(await fromObj(data, { invert }));
};

export default readObj;
