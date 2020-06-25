import { cacheRewriteTags } from '@jsxcad/cache';
import { hasMatchingTag } from './hasMatchingTag';
import { rewrite } from './visit';

const buildCondition = (conditionTags, conditionSpec) => {
  switch (conditionSpec) {
    case 'has':
      return (geometryTags) => hasMatchingTag(geometryTags, conditionTags);
    case 'has not':
      return (geometryTags) => !hasMatchingTag(geometryTags, conditionTags);
    default:
      return undefined;
  }
};

const rewriteTagsImpl = (
  add,
  remove,
  geometry,
  conditionTags,
  conditionSpec
) => {
  const condition = buildCondition(conditionTags, conditionSpec);
  const composeTags = (geometryTags) => {
    if (condition === undefined || condition(geometryTags)) {
      if (geometryTags === undefined) {
        return add.filter((tag) => !remove.includes(tag));
      } else {
        return [...add, ...geometryTags].filter((tag) => !remove.includes(tag));
      }
    } else {
      return geometryTags;
    }
  };

  const op = (geometry, descend) => {
    if (geometry.assembly || geometry.disjointAssembly) {
      // These structural geometries don't take tags.
      return descend();
    }
    const composedTags = composeTags(geometry.tags);
    if (composedTags === undefined) {
      const copy = { ...geometry };
      delete copy.tags;
      return copy;
    }
    if (composedTags === geometry.tags) {
      return geometry;
    } else {
      return descend({ tags: composedTags });
    }
  };

  return rewrite(geometry, op);
};

export const rewriteTags = cacheRewriteTags(rewriteTagsImpl);
