import { Shape } from './Shape';
import { fromDst } from '@jsxcad/convert-dst';
import { readFile } from '@jsxcad/sys';

export const readDst = async ({ path }) => Shape.fromGeometry(fromDst({}, await readFile(path)));
