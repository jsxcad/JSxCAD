import { cacheRewriteTags } from '@jsxcad/cache';
import { hasMatchingTag } from './hasMatchingTag';
import { rewriteUp } from './rewrite';

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

const rewriteTagsImpl = (add, remove, geometry, conditionTags, conditionSpec) => {
  const condition = buildCondition(conditionTags, conditionSpec);
  const composeTags = (geometryTags) => {
    if (condition === undefined || condition(geometryTags)) {
      if (geometryTags === undefined) {
        return add.filter(tag => !remove.includes(tag));
      } else {
        return [...add, ...geometryTags].filter(tag => !remove.includes(tag));
      }
    } else {
      return geometryTags;
    }
  };

  const op = (geometry) => {
    if (geometry.assembly || geometry.disjointAssembly) {
      // These structural geometries don't take tags.
      return geometry;
    }
    const composedTags = composeTags(geometry.tags);
    if (composedTags === undefined) {
      const copy = { ...geometry };
      delete copy.tags;
      return copy;
    } if (composedTags === geometry.tags) {
      return geometry;
    } else {
      return { ...geometry, tags: composedTags };
    }
  };

  return rewriteUp(geometry, op);
};

/*
const rewriteTagsImplOld = (add, remove, geometry, conditionTags, conditionSpec) => {
  const condition = buildCondition(conditionTags, conditionSpec);
  const composeTags = (geometryTags) => {
    if (condition === undefined || condition(geometryTags)) {
      if (geometryTags === undefined) {
        return add.filter(tag => !remove.includes(tag));
      } else {
        return [...add, ...geometryTags].filter(tag => !remove.includes(tag));
      }
    } else {
      return geometryTags;
    }
  };

  // FIX: Minimize identity churn.
  const walk = (geometry) => {
    if (geometry.assembly) { return { assembly: geometry.assembly.map(walk) }; }
    if (geometry.disjointAssembly) { return { disjointAssembly: geometry.disjointAssembly.map(walk) }; }
    if (geometry.connection) { return { connection: geometry.connection, geometries: geometry.geometries.map(walk), connectors: geometry.connectors.map(walk), tags: composeTags(geometry.tags) }; }
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
*/

export const rewriteTags = cacheRewriteTags(rewriteTagsImpl);
