import Group from './Group.js';
import Shape from './Shape.js';
import { visit } from '@jsxcad/geometry';

export const get =
  (path, ...ops) =>
  (shape) => {
    const picks = [];
    const walk = (geometry, descend, path) => {
      if (geometry.type === 'item') {
        if (path.length > 0) {
          if (geometry.tags && geometry.tags.includes(path[0])) {
            if (path.length > 1) {
              return descend(path.slice(1));
            } else {
              picks.push(Shape.fromGeometry(geometry).op(...ops));
            }
          }
        }
      }
      return descend();
    };
    visit(
      shape.toGeometry(),
      walk,
      path.split('/').map((tag) => `item:${tag}`)
    );
    return Group(...picks);
  };

Shape.registerMethod('get', get);
