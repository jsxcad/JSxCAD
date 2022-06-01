import { toConcreteGeometry } from './toConcreteGeometry.js';
import { visit } from './visit.js';

export const linearize = (
  geometry,
  filter,
  out = [],
  includeSketches = false
) => {
  const collect = (geometry, descend) => {
    if (filter(geometry)) {
      out.push(geometry);
    }
    if (includeSketches || geometry.type !== 'sketch') {
      descend();
    }
  };
  visit(toConcreteGeometry(geometry), collect);
  return out;
};
