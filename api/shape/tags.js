import { Shape } from './Shape.js';
import { getLeafs } from '@jsxcad/geometry';
import { note } from './note.js';
import { tagMatcher } from './tag.js';

export const tags = Shape.registerMethod2(
  'tags',
  ['input', 'string', 'function'],
  async (input, tag = '*', op = (...tags) => note(`tags: ${tags}`)) => {
    const isMatchingTag = tagMatcher(tag, 'user');
    const collected = [];
    for (const { tags } of getLeafs(await input.toGeometry())) {
      for (const tag of tags) {
        if (isMatchingTag(tag)) {
          collected.push(tag);
        }
      }
    }
    const result = op(...collected)(input);
    return result;
  }
);
