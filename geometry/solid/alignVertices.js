import { createNormalize3 } from "@jsxcad/algorithm-quantize";
import { deduplicate } from "@jsxcad/geometry-path";
import { toPlane } from "@jsxcad/math-poly3";

export const alignVertices = (solid, normalize3 = createNormalize3()) => {
  const aligned = solid.map((surface) =>
    surface
      .map((polygon) => deduplicate(polygon.map(normalize3)))
      .filter((polygon) => polygon.length >= 3)
      .filter((polygon) => toPlane(polygon) !== undefined)
  );
  return aligned;
};
