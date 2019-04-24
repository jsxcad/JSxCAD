import { hasMatchingTag } from './hasMatchingTag';

export const toComponents = ({ requires, excludes }, assembly) => {
  const components = [];

  const walk = (taggedGeometries) => {
    for (const taggedGeometry of taggedGeometries) {
      if (hasMatchingTag(excludes, taggedGeometry.tags)) {
        continue;
      } else if (hasMatchingTag(requires, taggedGeometry.tags, true)) {
        components.push(taggedGeometry);
      } else if (taggedGeometry.assembly !== undefined) {
        walk(taggedGeometry.assembly);
      }
    }
  };
  walk(assembly);
  return components;
};
