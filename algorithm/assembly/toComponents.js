import { hasMatchingTag } from './hasMatchingTag';

export const toComponents = ({ requires, excludes }, geometry) => {
  const components = [];

  const walk = (geometry) => {
    for (const item of geometry.assembly) {
      if (hasMatchingTag(excludes, item.tags)) {
        continue;
      } else if (hasMatchingTag(requires, item.tags, true)) {
        components.push(item);
      } else if (item.assembly !== undefined) {
        walk(item);
      }
    }
  };
  walk(geometry);
  return components;
};
