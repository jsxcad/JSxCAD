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
      const { tags, type } = geometry;
      if (type === 'group') {
        return descend();
      }
      for (const tag of tags) {
        if (isMatch(tag)) {
          picks.push(Shape.fromGeometry(geometry));
          break;
        }
      }
      if (type !== 'item') {
        return descend();
      }
    };
    const geometry = shape.toGeometry();
    if (geometry.type === 'item') {
      // FIX: Can we make this less magical?
      // This allows constructions like s.get('a').get('b')
      visit(geometry.content[0], walk);
    } else {
      visit(geometry, walk);
    }
    return Group(...picks);
  };

export const g = get;

Shape.registerMethod('get', get);
Shape.registerMethod('g', get);
