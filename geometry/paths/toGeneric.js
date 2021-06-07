import { map } from './map.js';
import { toGeneric as toGenericPath } from '../geometry-path';

export const toGeneric = (paths) => map(paths, toGenericPath);
