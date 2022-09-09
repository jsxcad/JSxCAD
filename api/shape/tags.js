import { Shape } from './Shape.js';
import { getLeafs } from '@jsxcad/geometry';
import { note } from './note.js';

export const tags = Shape.chainable(
  (namespace = 'user', op = (tags) => note(`tags: ${tags}`)) =>
    (shape) => {
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
    }
);

Shape.registerMethod('tags', tags);
