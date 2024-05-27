import { visit } from './visit.js';

export const linearize = (
  geometry,
  filter,
  out = [],
  { includeSketches = false, includeItems = true } = {}
) => {
  const collect = (geometry, descend) => {
    if (filter(geometry)) {
      out.push(geometry);
    }
    if (geometry.type === 'sketch' && !includeSketches) {
      return;
    }
    if (geometry.type === 'item' && !includeItems) {
      return;
    }
    descend();
  };
  visit(geometry, collect);
  return out;
};
