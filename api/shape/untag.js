import Shape from './Shape.js';
import { oneOfTagMatcher } from './tag.js';
import { rewrite } from '@jsxcad/geometry';

export const untag =
  (...tags) =>
  (shape) => {
    const isMatch = oneOfTagMatcher(tags, 'user');
    const op = (geometry, descend) => {
      switch (geometry.type) {
        case 'group':
        case 'layout':
          return descend();
        default: {
          const { tags = [] } = geometry;
          const remaining = [];
          for (const tag of tags) {
            if (!isMatch(tag)) {
              remaining.push(tag);
            }
          }
          return descend({ tags: remaining });
        }
      }
    };
    return Shape.fromGeometry(rewrite(shape.toGeometry(), op));
  };

Shape.registerMethod('untag', untag);
