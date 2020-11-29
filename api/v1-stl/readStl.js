import Shape from '@jsxcad/api-v1-shape';
import { fromStl } from '@jsxcad/convert-stl';
import { read } from '@jsxcad/sys';

export const readStl = async (
  path,
  { src, format = 'ascii', geometry = 'graph' } = {}
) => {
  const data = await read(`source/${path}`, { sources: [path] });
  return Shape.fromGeometry(await fromStl(data, { format, geometry }));
};

export default readStl;
