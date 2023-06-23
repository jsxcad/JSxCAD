import { taggedGroup } from './tagged/taggedGroup.js';

export const And = (geometries) => taggedGroup({}, ...geometries);
export const and = (geometry, geometries) => taggedGroup({}, geometry, ...geometries);
