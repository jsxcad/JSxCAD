import { transform as transformOfPath } from "@jsxcad/geometry-path";

export const transform = (matrix, paths) =>
  paths.map((path) => transformOfPath(matrix, path));
