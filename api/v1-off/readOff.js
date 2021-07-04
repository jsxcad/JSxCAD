import Shape from '@jsxcad/api-v2';
import { fromOff } from '@jsxcad/convert-off';
import { read } from '@jsxcad/sys';

export const readOff = async (path, { src, invert = false } = {}) => {
  const data = await read(`source/${path}`, { sources: [path] });
  return Shape.fromGeometry(await fromOff(data, { invert }));
};

export default readOff;
