import { Shape } from './Shape.js';
import { rewrite } from '@jsxcad/geometry';

const selectToKeep = (matchTags, geometryTags) => {
  if (geometryTags === undefined) {
    return false;
  }
  for (const geometryTag of geometryTags) {
    if (matchTags.includes(geometryTag)) {
      return true;
    }
  }
  return false;
};

const selectToDrop = (matchTags, geometryTags) =>
  !selectToKeep(matchTags, geometryTags);

const keepOrDrop = (shape, tags, select) => {
  const matchTags = tags.map((tag) => `user/${tag}`);

  const op = (geometry, descend) => {
    // FIX: Need a more reliable way to detect leaf structure.
    switch (geometry.type) {
      case 'assembly':
      case 'disjointAssembly':
      case 'layers':
      case 'layout': {
        return descend();
      }
      case 'item':
      /* {
        if (
          geometry.tags === undefined ||
          !geometry.tags.some((tag) => matchTags.includes(tag))
        ) {
          // If the item isn't involved with these tags; treat it as a branch.
          return descend();
        }
      }
*/
      // falls through to deal with item as a leaf.
      default: {
        if (select(matchTags, geometry.tags)) {
          return descend();
        } else {
          // Operate on the shape.
          const shape = Shape.fromGeometry(geometry);
          // Note that this transform does not violate geometry disjunction.
          const dropped = shape.void().toGeometry();
          return dropped;
        }
      }
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

export const keep =
  (...tags) =>
  (shape) => {
    if (tags === undefined) {
      // Dropping no tags is an unconditional keep.
      return keepOrDrop(shape, [], selectToDrop);
    } else {
      return keepOrDrop(shape, tags, selectToKeep);
    }
  };

export const drop =
  (...tags) =>
  (shape) => {
    if (tags === undefined) {
      // Keeping no tags is an unconditional drop.
      return keepOrDrop(shape, [], selectToKeep);
    } else {
      return keepOrDrop(shape, tags, selectToDrop);
    }
  };

Shape.registerMethod('keep', keep);
Shape.registerMethod('drop', drop);
