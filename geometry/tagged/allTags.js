// FIX: Refactor the geometry walkers.

import { rewriteUp } from './rewrite';

export const allTags = (geometry) => {
  const collectedTags = new Set();
  const op = ({ tags }) => {
    if (tags !== undefined) {
      for (const tag of tags) {
        collectedTags.add(tag);
      }
    }
  };
  rewriteUp(geometry, op);
  return collectedTags;
};
