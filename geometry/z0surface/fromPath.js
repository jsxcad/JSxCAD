// move to tagged
import { cache } from '@jsxcad/cache';

const fromPathImpl = (path) => [path];

export const fromPath = cache(fromPathImpl);
