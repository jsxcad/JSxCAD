import Shape from '@jsxcad/api-v1-shape';
import { fromOff } from '@jsxcad/convert-off';
import { read } from '@jsxcad/sys';

export const readOff = async (path, { src } = {}) => {
  const data = await read(`source/${path}`, { sources: [path] });
  return Shape.fromGeometry(await fromOff(data));
};

export default readOff;
