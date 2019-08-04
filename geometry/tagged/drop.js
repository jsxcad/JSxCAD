import { addTags } from './addTags';
import { hasMatchingTag } from './hasMatchingTag';

// Dropped elements displace as usual, but are not included in positive output.

export const drop = (tags, geometry) => {
  const walk = (geometry) => {
    if (hasMatchingTag(tags, geometry.tags)) {
      return addTags(['@drop'], geometry);
    } else if (geometry.assembly) {
      return { ...geometry, assembly: geometry.assembly.map(walk) };
    } else if (geometry.disjointAssembly) {
      return { ...geometry, disjointAssembly: geometry.disjointAssembly.map(walk) };
    } else if (geometry.untransformed) {
      return { ...geometry, untransformed: walk(geometry.untransformed) };
    } else {
      return geometry;
    }
  };
  return walk(geometry);
};
