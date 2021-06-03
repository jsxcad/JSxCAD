import { transform as transformOfPath } from '../path/transform.js';

export const transform = (matrix, paths) =>
  paths.map((path) => transformOfPath(matrix, path));
