import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { getLeafs } from '@jsxcad/geometry';
import { note } from './note.js';
import { tagMatcher } from './tag.js';

export const tags = Shape.registerMethod('tags', (...args) => async (shape) => {
  const { string: tag = '*', func: op = (...tags) => note(`tags: ${tags}`) } =
    destructure(args);
  const isMatchingTag = tagMatcher(tag, 'user');
  const collected = [];
  for (const { tags } of getLeafs(await shape.toGeometry())) {
    for (const tag of tags) {
      if (isMatchingTag(tag)) {
        collected.push(tag);
      }
    }
  }
  const result = op(...collected)(shape);
  console.log(`QQ/tags/result: ${JSON.stringify(result)}`);
  return result;
});
