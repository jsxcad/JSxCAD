import { hasMatchingTag } from './hasMatchingTag';

// This needs to recursively walk the assembly.
export const filterAndFlattenAssemblyData = ({ requires, excludes, form }, geometry) => {
  const filtered = [];
  const walk = (geometry) => {
    for (const item of geometry.assembly) {
      if (item.assembly !== undefined) {
        walk(item);
      } else {
        const data = item[form];
        if (data === undefined || hasMatchingTag(excludes, item.tags)) {
          continue;
        }
        if (hasMatchingTag(requires, item.tags, true)) {
          filtered.push(data);
        }
      }
    };
  };
  walk(geometry);
  return filtered;
};
