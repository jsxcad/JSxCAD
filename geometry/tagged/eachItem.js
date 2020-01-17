import { rewriteUp } from './rewrite';

export const eachItem = (geometry, op, traverseItem = true) => {
  const read = (geometry) => {
    op(geometry);
    return geometry;
  };
  rewriteUp(geometry, read, traverseItem);
};
