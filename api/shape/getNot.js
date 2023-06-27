import { oneOfTagMatcher, visit } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

export const getNot = Shape.registerMethod2(
  ['getNot', 'gn'],
  ['inputGeometry', 'strings'],
  (geometry, tags) => {
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
    if (geometry.type === 'item') {
      // FIX: Can we make this less magical?
      // This allows constructions like s.get('a').get('b')
      visit(geometry.content[0], walk);
    } else {
      visit(geometry, walk);
    }
    return Group(...picks);
  }
);

export const gn = getNot;
