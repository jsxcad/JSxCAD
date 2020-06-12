import { alignVertices } from "./alignVertices";
import { createNormalize3 } from "@jsxcad/algorithm-quantize";

export const reconcile = (solid, normalize = createNormalize3()) =>
  alignVertices(solid, normalize);
