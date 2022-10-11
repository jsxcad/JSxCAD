import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { getLeafs } from '@jsxcad/geometry';
import { note } from './note.js';
import { tagMatcher } from './tag.js';

export const tags = Shape.chainable((...args) => (shape) => {
  const { string: tag = '*', func: op = (...tags) => note(`tags: ${tags}`) } =
    destructure(args);
  const isMatchingTag = tagMatcher(tag, 'user');
  const collected = [];
  for (const { tags } of getLeafs(shape.toGeometry())) {
    for (const tag of tags) {
      if (isMatchingTag(tag)) {
        collected.push(tag);
      }
    }
  }
  return op(...collected)(shape);
});

Shape.registerMethod('tags', tags);
