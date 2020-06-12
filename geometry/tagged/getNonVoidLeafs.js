import { isNotVoid } from "./isNotVoid";
import { visit } from "./visit";

// Retrieve leaf geometry.

export const getNonVoidLeafs = (geometry) => {
  const leafs = [];
  const op = (geometry, descend) => {
    if (
      geometry.assembly ||
      geometry.disjointAssembly ||
      geometry.layers ||
      geometry.content
    ) {
      descend();
    } else if (isNotVoid(geometry)) {
      leafs.push(geometry);
    }
  };
  visit(geometry, op);
  return leafs;
};
