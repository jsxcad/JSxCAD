import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { getLeafs } from '@jsxcad/geometry';
import { note } from './note.js';

export const tags = Shape.chainable((...args) => (shape) => {
  const {
    string: namespace = 'user',
    func: op = (tags) => note(`tags: ${tags}`),
  } = destructure(args);
  const prefix = `${namespace}:`;
  const collected = [];
  for (const { tags } of getLeafs(shape.toGeometry())) {
    for (const tag of tags) {
      if (tag.startsWith(prefix)) {
        collected.push(tag.substring(prefix.length));
      }
    }
  }
  return op(collected)(shape);
});

Shape.registerMethod('tags', tags);
