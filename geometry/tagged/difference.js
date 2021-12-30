import { cut } from './cut.js';

export const difference = (geometry, options = {}, ...geometries) =>
  cut(geometry, geometries);
