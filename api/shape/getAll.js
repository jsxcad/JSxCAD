import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { oneOfTagMatcher } from './tag.js';
import { visit } from '@jsxcad/geometry';

// get, ignoring item boundaries.

export const getAll = Shape.chainable((...args) => (shape) => {
  const { strings: tags, func: groupOp = Group } = destructure(args);
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
  const geometry = shape.toGeometry();
  visit(geometry, walk);
  return groupOp(...picks);
});

Shape.registerMethod('getAll', getAll);

export default getAll;
