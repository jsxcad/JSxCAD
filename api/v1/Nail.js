import { Cylinder } from "./Cylinder";
import { assertNumber } from "./assert";
import { dispatch } from "./dispatch";

/**
 *
 * # Nail
 *
 **/

export const Nail = dispatch("Nail", (radius, height) => {
  assertNumber(radius);
  assertNumber(height);
  return () => Cylinder(radius, height, 3).move(0, 0, height / -2);
});
