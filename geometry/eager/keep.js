import { addTags } from './addTags';
import { hasMatchingTag } from './hasMatchingTag';

// Keep drops everything that doesn't match here or toward the root.

export const keep = (tags, geometry) => {
  const walk = (geometry) => {
    if (hasMatchingTag(tags, geometry.tags)) {
      return geometry;
    } else if (geometry.assembly) {
      // Might be something to keep in here.
      return { ...geometry, assembly: geometry.assembly.map(walk) };
    } else {
      // Drop it.
      return addTags(['@drop'], geometry);
    }
  };
  return walk(geometry);
};
