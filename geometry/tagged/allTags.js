import { eachItem } from './eachItem';

// FIX: Refactor the geometry walkers.

export const allTags = (geometry) => {
  const tags = new Set();
  const walk = (item) => {
    if (item.tags) {
      for (const tag of item.tags) {
        tags.add(tag);
      }
    }
    if (item.assembly) {
      item.assembly.forEach(walk);
    } else if (item.disjointAssembly) {
      item.disjointAssembly.forEach(walk);
    } else if (item.untransformed) {
      walk(item.untransformed);
    }
  };
  walk(geometry);
  return tags;
}
