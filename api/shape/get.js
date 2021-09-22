import Group from './Group.js';
import Shape from './Shape.js';
import { oneOfTagMatcher } from './tag.js';
import { visit } from '@jsxcad/geometry';

export const get =
  (...tags) =>
  (shape) => {
    const isMatch = oneOfTagMatcher(tags, 'item');
    const picks = [];
    const walk = (geometry, descend) => {
      const { tags = [] } = geometry;
      for (const tag of tags) {
        if (isMatch(tag)) {
          picks.push(Shape.fromGeometry(geometry));
          break;
        }
      }
      if (geometry.type !== 'item') {
        return descend();
      }
    };
    visit(shape.toGeometry(), walk);
    return Group(...picks);
  };

export const g = get;

Shape.registerMethod('get', get);
Shape.registerMethod('g', get);
