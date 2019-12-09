import { rewriteUp } from './rewrite';

export const eachItem = (geometry, operation) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    } else if (geometry.item) {
      walk(geometry.item);
    } else if (geometry.disjointAssembly) {
      geometry.disjointAssembly.forEach(walk);
    } else if (geometry.connection) {
      geometry.geometries.forEach(walk);
    }
    operation(geometry);
  };
  walk(geometry);
};

export const eachItemAlt = (geometry, op) => {
  const read = (geometry) => {
    op(geometry);
    return geometry;
  };
  rewriteUp(geometry, read);
};
