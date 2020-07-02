import { Shape } from './Shape.js';
import { measureBoundingBox as measureBoundingBoxOfGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Measure Bounding Box
 *
 * Provides the corners of the smallest orthogonal box containing the shape.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Sphere(7)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * const [corner1, corner2] = Sphere(7).measureBoundingBox();
 * Cube.fromCorners(corner1, corner2)
 * ```
 * :::
 **/

export const measureBoundingBox = (shape) =>
  measureBoundingBoxOfGeometry(shape.toGeometry());

const measureBoundingBoxMethod = function () {
  return measureBoundingBox(this);
};
Shape.prototype.measureBoundingBox = measureBoundingBoxMethod;

export default measureBoundingBox;

measureBoundingBox.signature = 'measureBoundingBox(shape:Shape) -> BoundingBox';
measureBoundingBoxMethod.signature =
  'Shape -> measureBoundingBox() -> BoundingBox';
