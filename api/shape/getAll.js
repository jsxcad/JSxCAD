import Group from './Group.js';
import Shape from './Shape.js';
import { oneOfTagMatcher } from './tag.js';
import { visit } from '@jsxcad/geometry';

// get, ignoring item boundaries.

export const getAll = Shape.registerMethod2(
  'getAll',
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
      return descend();
    };
    visit(geometry, walk);
    return groupOp(...picks);
  }
);

export default getAll;
