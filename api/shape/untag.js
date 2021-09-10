import Shape from './Shape.js';
import { rewrite } from '@jsxcad/geometry';
import { tagMatcher } from './tag.js';

export const untag =
  (...tags) =>
  (shape) => {
    const matchers = tags.map((tag) => tagMatcher(tag, 'user'));
    const isMatch = (tag) => {
      for (const matcher of matchers) {
        if (matcher(tag)) {
          return true;
        }
      }
      return false;
    };
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
