import { map } from "./map";
import { toZ0Polygon } from "@jsxcad/geometry-path";

export const toZ0Polygons = (paths) => {
  if (paths.isZ0Polygons !== true) {
    paths = map(paths, toZ0Polygon);
    paths.isZ0Polygons = true;
  }
  return paths;
};
