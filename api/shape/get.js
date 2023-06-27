import { oneOfTagMatcher, visit } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

export const get = Shape.registerMethod2(
  ['get', 'g'],
  ['inputGeometry', 'strings', 'function'],
  (geometry, tags, groupOp = Group) => {
    const isMatch = oneOfTagMatcher(tags, 'item');
    const picks = [];
    const walk = (geometry, descend) => {
      const { tags, type } = geometry;
      if (type === 'group') {
        return descend();
      }
      if (isMatch(`type:${geometry.type}`)) {
        picks.push(Shape.fromGeometry(geometry));
      } else {
        for (const tag of tags) {
          if (isMatch(tag)) {
            picks.push(Shape.fromGeometry(geometry));
            break;
          }
        }
      }
      if (type !== 'item') {
        return descend();
      }
    };
    visit(geometry, walk);
    return groupOp(...picks);
  }
);

export const g = get;

export default get;
