import { measureArea as measureAreaOfPolygon } from "@jsxcad/math-poly3";

export const measureArea = (surface) => {
  // CHECK: That this handles negative area properly.
  let total = 0;
  for (const polygon of surface) {
    total += measureAreaOfPolygon(polygon);
  }
  return total;
};
