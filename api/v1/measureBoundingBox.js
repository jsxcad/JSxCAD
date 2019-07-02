import { Shape } from './Shape';
import { measureBoundingBox as measureBoundingBoxOfGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Measure Bounding Box
 *
 * Provides the corners of the smallest orthogonal box containing the shape.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * sphere(7)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * const [corner1, corner2] = sphere(7).measureBoundingBox();
 * cube({ corner1, corner2 })
 * ```
 * :::
 **/

export const measureBoundingBox = (shape) => measureBoundingBoxOfGeometry(shape.toGeometry());

const method = function () { return measureBoundingBox(this); };

Shape.prototype.measureBoundingBox = method;
