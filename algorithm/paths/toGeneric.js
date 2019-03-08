import { map } from './map';
import { toGeneric as toGenericPath } from '@jsxcad/algorithm-path';

export const toGeneric = (paths) => map(paths, toGenericPath);
