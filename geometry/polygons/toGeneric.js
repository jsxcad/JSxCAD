import { map } from "./map";
import { map as mapOfPoly3 } from "@jsxcad/math-poly3";

export const toGeneric = (polygons) => map(polygons, mapOfPoly3);
