import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  buildRegularPolygon,
  regularPolygonEdgeLengthToRadius,
} from '@jsxcad/algorithm-shape';

import { taggedZ0Surface } from '@jsxcad/geometry-tagged';

/**
 *
 * # Square (rectangle)
 *
 * Properly speaking what is produced here are rectangles.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Square()
 * ```
 * :::
 * ::: illustration
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * Square(6, 12)
 * ```
 * :::
 * ::: illustration
 * ```
 * Square({ edge: 10 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10),
 *          Square({ radius: 10 })
 *            .drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Square({ apothem: 10 }),
 *          Circle(10).drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * Square({ diameter: 20 })
 * ```
 * :::
 **/

const toRadiusFromApothem = (apothem) => apothem / Math.cos(Math.PI / 4);

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);
const unitSquare = () =>
  Shape.fromGeometry(taggedZ0Surface({}, [buildRegularPolygon(4)]))
    .rotateZ(45)
    .scale(edgeScale);

export const ofSize = (width = 1, length) =>
  unitSquare().scale([width, length === undefined ? width : length, 1]);
export const ofRadius = (radius) =>
  Shape.fromGeometry(taggedZ0Surface({}, [buildRegularPolygon(4)]))
    .rotateZ(45)
    .scale(radius);
export const ofApothem = (apothem) => ofRadius(toRadiusFromApothem(apothem));
export const ofDiameter = (diameter) => ofRadius(diameter / 2);

export const fromCorners = (corner1, corner2) => {
  const [c1x, c1y] = corner1;
  const [c2x, c2y] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2];
  return unitSquare().scale([length, width]).translate(center);
};

export const Square = (...args) => ofSize(...args);

Square.ofSize = ofSize;
Square.ofRadius = ofRadius;
Square.ofApothem = ofApothem;
Square.ofDiameter = ofDiameter;
Square.fromCorners = fromCorners;

Shape.prototype.Square = shapeMethod(Square);

export default Square;
