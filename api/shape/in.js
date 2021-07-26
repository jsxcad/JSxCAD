import Shape from './Shape.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { qualifyTagPath } from './tag.js';
import { rewrite } from '@jsxcad/geometry';

export const inFn =
  (path, ...ops) =>
  (shape) => {
    const walk = (geometry, descend, walk, path) => {
      if (geometry.type === 'item') {
        if (path.length > 0) {
          if (
            path[0] === 'tagpath:*' ||
            (geometry.tags && geometry.tags.includes(path[0]))
          ) {
            if (path.length > 1) {
              return descend({}, path.slice(1));
            } else {
              // This is a target.
              const global = geometry.matrix;
              const local = invertTransform(global);
              const target = Shape.fromGeometry(geometry);
              // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
              return target
                .transform(local)
                .op(...ops)
                .transform(global)
                .toGeometry();
            }
          }
        }
      } else {
        return descend(path);
      }
    };

    return Shape.fromGeometry(
      rewrite(shape.toGeometry(), walk, qualifyTagPath(path, 'item'))
    );
  };

Shape.registerMethod('in', inFn);
