import { Shape } from './Shape';
import { rewrite } from '@jsxcad/geometry-tagged';

/**
 *
 * # Keep in assembly
 *
 * Generates an assembly from components in an assembly with a tag.
 *
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .keep('A')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .keep('B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .keep('A', 'B')
 * ```
 * :::
 *
 **/

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

const selectToDrop = (matchTags, geometryTags) => !selectToKeep(matchTags, geometryTags);

const keepOrDrop = (shape, tags, select) => {
  const matchTags = tags.map(tag => `user/${tag}`);

  const op = (geometry, descend) => {
    // FIX: Need a more reliable way to detect leaf structure.
    if (geometry.solid || geometry.surface || geometry.z0Surface || geometry.points || geometry.paths || geometry.item) {
      if (select(matchTags, geometry.tags)) {
        return descend();
      } else {
        // Operate on the shape.
        const shape = Shape.fromGeometry(geometry);
        // Note that this transform does not violate geometry disjunction.
        const dropped = shape.Void().layer(shape.sketch()).toGeometry();
        return dropped;
      }
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

export const keep = (shape, tags) => keepOrDrop(shape, tags, selectToKeep);
export const drop = (shape, tags) => keepOrDrop(shape, tags, selectToDrop);

const keepMethod = function (...tags) { return keep(this, tags); };
Shape.prototype.keep = keepMethod;

const dropMethod = function (...tags) { return drop(this, tags); };
Shape.prototype.drop = dropMethod;
