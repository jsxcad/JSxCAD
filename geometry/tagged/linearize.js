import { toConcreteGeometry } from './toConcreteGeometry.js';
import { visit } from './visit.js';

export const linearize = (geometry, filter, out = []) => {
  const collect = (geometry, descend) => {
    if (filter(geometry)) {
      out.push(geometry);
    }
    descend();
  };
  visit(toConcreteGeometry(geometry), collect);
  return out;
};
