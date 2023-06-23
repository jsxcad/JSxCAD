import Shape from './Shape.js';
import { oneOfTagMatcher } from './tag.js';
import { rewrite } from '@jsxcad/geometry';

export const retagOp = (geometry, oldTags, newTags) => {
  const isOldTagMatch = oneOfTagMatcher(oldTags, 'user');
  const isNewTagMatch = oneOfTagMatcher(newTags, 'user');
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
      case 'layout':
        return descend();
      default: {
        const { tags = [] } = geometry;
        const remaining = [];
        for (const tag of tags) {
          if (!isOldTagMatch(tag)) {
            remaining.push(tag);
          }
        }
        for (const newTag of newTags) {
          if (!remaining.includes(newTag)) {
            remaining.push(newTag);
          }
        }
        return descend({ tags: remaining });
      }
    }
  };
  const result = rewrite(geometry, op);
  return result;
};

export const untagOp = (geometry, oldTags) => retagOp(geometry, oldTags, []);
export const tagOp = (geometry, newTags) => retagOp(geometry, [], newTags);

export const untag = Shape.registerMethod3(
  'untag',
  ['inputGeometry', 'strings'],
  untagOp
);
