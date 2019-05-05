import { Shape } from './Shape';
import { fromStl } from '@jsxcad/convert-stl';
import { readFile } from '@jsxcad/sys';

export const readStl = async (options) => {
  const { path } = options;
  return Shape.fromGeometry(await fromStl(options, await readFile(options, path)));
};
