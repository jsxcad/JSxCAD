import Group from './Group.js';
import Shape from './Shape.js';
import { qualifyTagPath } from './tag.js';
import { visit } from '@jsxcad/geometry';

export const get =
  (path, ...ops) =>
  (shape) => {
    if (ops.length === 0) {
      ops = [(x) => x];
    }
    const picks = [];
    const walk = (geometry, descend, path) => {
      if (geometry.type === 'item') {
        if (path.length > 0) {
          if (
            path[0] === 'tagpath:*' ||
            (geometry.tags && geometry.tags.includes(path[0]))
          ) {
            if (path.length > 1) {
              return descend(path.slice(1));
            } else {
              picks.push(Shape.fromGeometry(geometry).op(...ops));
            }
          }
        }
      } else {
        return descend(path);
      }
    };
    visit(shape.toGeometry(), walk, qualifyTagPath(path, 'item'));
    return Group(...picks);
  };

Shape.registerMethod('get', get);
Shape.registerMethod('g', get);
