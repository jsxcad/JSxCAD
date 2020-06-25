import { visit } from './visit';

// Retrieve leaf geometry.

export const getLeafs = (geometry) => {
  const leafs = [];
  const op = (geometry, descend) => {
    if (
      geometry.assembly ||
      geometry.disjointAssembly ||
      geometry.layers ||
      geometry.content
    ) {
      descend();
    } else {
      leafs.push(geometry);
    }
  };
  visit(geometry, op);
  return leafs;
};
