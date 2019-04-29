import { Assembly } from './Assembly';
import { fromDst } from '@jsxcad/convert-dst';
import { readFile } from '@jsxcad/sys';

export const readDst = async ({ path }) => Assembly.fromGeometry(fromDst({}, await readFile(path)));
