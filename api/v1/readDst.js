import { Shape } from './Shape';
import { fromDst } from '@jsxcad/convert-dst';
import { readFile } from '@jsxcad/sys';

export const readDst = async (options) => {
  const { path } = options;
  return Shape.fromGeometry(await fromDst(options, await readFile(options, path)));
};
