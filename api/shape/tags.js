import { getLeafs, tagMatcher } from '@jsxcad/geometry';

import { Shape } from './Shape.js';
import { note } from './note.js';

export const tags = Shape.registerMethod3(
  'tags',
  ['inputGeometry', 'string', 'function'],
  async (geometry, tag = '*', op = (...tags) => note(`tags: ${tags}`)) => {
    const isMatchingTag = tagMatcher(tag, 'user');
    const collected = [];
    for (const { tags } of getLeafs(geometry)) {
      for (const tag of tags) {
        if (isMatchingTag(tag)) {
          collected.push(tag);
        }
      }
    }
    const result = Shape.applyToGeometry(geometry, op, ...collected);
    return result;
  }
);
