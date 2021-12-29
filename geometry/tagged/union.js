import { join } from './join.js';

export const union = (geometry, ...geometries) => join(geometry, geometries);
