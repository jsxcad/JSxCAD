import { hasMatchingTag } from './hasMatchingTag';
import { map } from './map';

// This needs to recursively walk the assembly.
export const filterAndFlattenAssemblyData = ({ requires, excludes, form }, geometry) => {
  const filtered = [];
  const filter = (item) => {
    const data = item[form];
    if (data === undefined || hasMatchingTag(excludes, item.tags)) {
      return item;
    }
    if (hasMatchingTag(requires, item.tags, true)) {
      filtered.push(data);
    }
    return item;
  };
  map(geometry, filter);
  return filtered;
};
