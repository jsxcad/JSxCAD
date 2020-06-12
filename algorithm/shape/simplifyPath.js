import { isClosed } from "@jsxcad/geometry-path";
import simplifyPathAlgorithm from "simplify-path";

export const simplifyPath = (path, tolerance = 0.01) => {
  if (isClosed(path)) {
    return simplifyPathAlgorithm(path, tolerance);
  } else {
    return [null, ...simplifyPathAlgorithm(path.slice(1), tolerance)];
  }
};
