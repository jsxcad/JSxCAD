import { cacheAddTags } from '@jsxcad/cache';
import { hasMatchingTag } from './hasMatchingTag';

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

const addTagsImpl = (tags, geometry, conditionTags, conditionSpec) => {
  const condition = buildCondition(conditionTags, conditionSpec);
  const composeTags = (geometryTags) => {
    if (condition === undefined || condition(geometryTags)) {
      if (geometryTags === undefined) {
        return tags;
      } else {
        return [...tags, ...geometryTags];
      }
    } else {
      return geometryTags;
    }
  };

  // FIX: Minimize identity churn.
  const walk = (geometry) => {
    if (geometry.assembly) { return { assembly: geometry.assembly.map(walk) }; }
    if (geometry.disjointAssembly) { return { disjointAssembly: geometry.disjointAssembly.map(walk) }; }
    if (geometry.item) { return { item: walk(geometry.item), tags: composeTags(geometry.tags) }; }
    if (geometry.paths) { return { paths: geometry.paths, tags: composeTags(geometry.tags) }; }
    if (geometry.plan) { return { plan: geometry.plan, marks: geometry.marks, planes: geometry.planes, visualization: geometry.visualization, tags: composeTags(geometry.tags) }; }
    if (geometry.points) { return { points: geometry.points, tags: composeTags(geometry.tags) }; }
    if (geometry.solid) { return { solid: geometry.solid, tags: composeTags(geometry.tags) }; }
    if (geometry.surface) { return { surface: geometry.surface, tags: composeTags(geometry.tags) }; }
    if (geometry.untransformed) { return { untransformed: walk(geometry.untransformed), matrix: geometry.matrix }; }
    if (geometry.z0Surface) { return { z0Surface: geometry.z0Surface, tags: composeTags(geometry.tags) }; }
    throw Error('die');
  };

  return walk(geometry);
};

export const addTags = cacheAddTags(addTagsImpl);
