import Group from './Group.js';
import Shape from './Shape.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';

export const at = (other, path) => (shape) => {
  const reoriented = [];
  for (const item of other.get(path).each()) {
    reoriented.push(shape.transform(invertTransform(item.toGeometry().matrix)));
  }
  return Group(...reoriented);
};

Shape.registerMethod('at', at);
