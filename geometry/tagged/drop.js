import { addTags } from './addTags';
import { hasMatchingTag } from './hasMatchingTag';

// Dropped elements displace as usual, but are not included in positive output.

export const drop = (tags, geometry) => {
  const walk = (geometry) => {
    if (hasMatchingTag(tags, geometry.tags)) {
      return addTags(['@drop'], geometry);
    } else if (geometry.assembly) {
      return { ...geometry, assembly: geometry.assembly.map(walk) };
    } else {
      return geometry;
    }
  };
  return walk(geometry);
};
