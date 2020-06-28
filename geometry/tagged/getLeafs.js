import { visit } from './visit';

// Retrieve leaf geometry.

export const getLeafs = (geometry) => {
  const leafs = [];
  const op = (geometry, descend) => {
    if (geometry.assembly ||
        geometry.disjointAssembly ||
        geometry.layers) {
      descend();
    } else if (geometry.plan) {
      // This is a bit confused -- the plan is a leaf, but has content.
      leafs.push(geometry);
      descend();
    } else {
      leafs.push(geometry);
    }
  };
  visit(geometry, op);
  return leafs;
};
