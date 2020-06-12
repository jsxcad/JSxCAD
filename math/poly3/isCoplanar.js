import { signedDistanceToPoint as planeDistance } from "@jsxcad/math-plane";
import { toPlane } from "./toPlane";

export const isCoplanar = (polygon) => {
  const plane = toPlane(polygon);
  for (const point of polygon) {
    if (planeDistance(plane, point) > 1e-5) {
      return false;
    }
  }
  return true;
};
