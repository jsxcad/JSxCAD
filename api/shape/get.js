import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { oneOfTagMatcher } from './tag.js';
import { visit } from '@jsxcad/geometry';

export const get = Shape.registerMethod(['get', 'g'], (...args) => (shape) => {
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
    if (type !== 'item') {
      return descend();
    }
  };
  const geometry = shape.toGeometry();
  visit(geometry, walk);
  return groupOp(...picks);
});

export const g = get;

export default get;
