import { toConcreteGeometry } from './toConcreteGeometry.js';
import { visit } from './visit.js';

export const linearize = (geometry, types, out) => {
  const collect = (geometry, descend) => {
    if (types.includes(geometry.type)) {
      out.push(geometry);
    }
    descend();
  };
  visit(toConcreteGeometry(geometry), collect);
};
