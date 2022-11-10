import Group from './Group.js';
import Shape from './Shape.js';
import { oneOfTagMatcher } from './tag.js';
import { visit } from '@jsxcad/geometry';

export const getNot = Shape.registerMethod(
  ['getNot', 'gn'],
  (...tags) =>
    (shape) => {
      const isMatch = oneOfTagMatcher(tags, 'item');
      const picks = [];
      const walk = (geometry, descend) => {
        const { tags, type } = geometry;
        if (type === 'group') {
          return descend();
        }
        let discard = false;
        if (isMatch(`type:${geometry.type}`)) {
          discard = true;
        } else {
          for (const tag of tags) {
            if (isMatch(tag)) {
              discard = true;
              break;
            }
          }
        }
        if (!discard) {
          picks.push(Shape.fromGeometry(geometry));
        }
        if (type !== 'item') {
          return descend();
        }
      };
      console.log(`QQ/getNot/1`);
      const geometry = shape.toGeometry();
      console.log(`QQ/getNot/2`);
      if (geometry.type === 'item') {
        // FIX: Can we make this less magical?
        // This allows constructions like s.get('a').get('b')
        visit(geometry.content[0], walk);
      } else {
        visit(geometry, walk);
      }
      console.log(`QQ/getNot/3`);
      return Group(...picks);
    }
);

export const gn = getNot;
