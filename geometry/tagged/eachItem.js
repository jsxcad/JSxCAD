import { rewriteUp } from './rewrite';

export const eachItem = (geometry, op) => {
  const read = (geometry) => {
    op(geometry);
    return geometry;
  };
  rewriteUp(geometry, read);
};
