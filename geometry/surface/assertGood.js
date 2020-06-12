import { assertUnique } from "@jsxcad/geometry-path";
import { toPlane } from "@jsxcad/math-poly3";

export const assertGood = (surface) => {
  for (const path of surface) {
    assertUnique(path);
    if (toPlane(path) === undefined) {
      console.log(`QQ/path: ${JSON.stringify(path)}`);
      throw Error("die");
    }
  }
};
