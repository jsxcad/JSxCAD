import { Shape } from './Shape.js';
import { rewrite } from '@jsxcad/geometry';
import { tagMatcher } from './tag.js';

export const drop =
  (...tags) =>
  (shape) => {
    const matchers = tags.map((tag) => tagMatcher(tag, 'user'));
    const isMatch = (tags, tag) => {
      for (const matcher of matchers) {
        for (tag of tags) {
          if (matcher(tag)) {
            return true;
          }
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
          // Should this pass through item boundaries?
          const { tags = [] } = geometry;
          if (isMatch(tags)) {
            return Shape.fromGeometry(geometry).void().toGeometry();
          } else if (geometry.type !== 'item') {
            return descend();
          }
        }
      }
    };
    return Shape.fromGeometry(rewrite(shape.toGeometry(), op));
  };

Shape.registerMethod('drop', drop);
