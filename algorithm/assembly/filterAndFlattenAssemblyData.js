import { hasMatchingTag } from './hasMatchingTag';

// This needs to recursively walk the assembly.
export const filterAndFlattenAssemblyData = ({ requires, excludes, form }, assembly) => {
  const filtered = [];
  const walk = (assembly) => {
    for (const entry of assembly) {
      if (entry.assembly !== undefined) {
        walk(entry.assembly);
      } else {
        const data = entry[form];
        if (data === undefined || hasMatchingTag(excludes, entry.tags)) {
          continue;
        }
        if (hasMatchingTag(requires, entry.tags, true)) {
          filtered.push(data);
        }
      }
    };
  };
  walk(assembly);
  return filtered;
};
