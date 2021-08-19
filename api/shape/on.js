import Shape from './Shape.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { qualifyTagPath } from './tag.js';
import { rewrite } from '@jsxcad/geometry';

export const on =
  (path, ...ops) =>
  (shape) => {
    ops = ops.map(op => op instanceof Function ? op : () => op);
    if (path instanceof Function) {
      // We've already selected the item to replace, e.g., s.on(g('plate'), ...);
      const selection = path(shape).toGeometry();
      // FIX: Make this more robust?
      const items = selection.type === 'item' ? [selection] : selection.content;
      const walk = (geometry, descend) => {
        if (geometry.type === 'item') {
          if (items.includes(geometry)) {
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
        return descend();
      };
      return Shape.fromGeometry(rewrite(shape.toGeometry(), walk));
    }

    const walk = (geometry, descend, walk, path) => {
      if (geometry.type === 'item') {
        if (path.length >= 1) {
          if (
            path[0] === 'tagpath:*' ||
            (geometry.tags && geometry.tags.includes(path[0]))
          ) {
            if (path.length >= 2) {
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
          } else {
            return geometry;
          }
        } else {
          // We ran out of path without finding anything, which should be impossible.
          throw Error('Path exhausted');
        }
      }
      return descend({}, path);
    };

    return Shape.fromGeometry(
      rewrite(shape.toGeometry(), walk, qualifyTagPath(path, 'item'))
    );
  };

Shape.registerMethod('on', on);
