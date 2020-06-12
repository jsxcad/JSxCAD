import { reallyQuantizeForSpace } from "@jsxcad/math-utils";

export const canonicalize = (polygons) =>
  polygons.map((polygon) =>
    polygon.map((point) => point.map((value) => reallyQuantizeForSpace(value)))
  );
