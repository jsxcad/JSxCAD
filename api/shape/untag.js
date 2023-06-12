import Shape from './Shape.js';
import { oneOfTagMatcher } from './tag.js';
import { rewrite } from '@jsxcad/geometry';

export const untagGeometry = (geometry, tags) => {
  const isMatch = oneOfTagMatcher(tags, 'user');
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
      case 'layout':
        return descend();
      default: {
        const { tags = [] } = geometry;
        const remaining = [];
        for (const tag of tags) {
          if (!isMatch(tag)) {
            remaining.push(tag);
          }
        }
        return descend({ tags: remaining });
      }
    }
  };
  return rewrite(geometry, op);
};

export const untag = Shape.registerMethod2(
  'untag',
  ['inputGeometry', 'strings'],
  (geometry, tags) => Shape.fromGeometry(untagGeometry(geometry, tags))
);
