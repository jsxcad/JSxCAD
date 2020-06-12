import { cache } from "@jsxcad/cache";
import { fromAngleRadians } from "@jsxcad/math-vec2";

/**
 * Construct a regular unit polygon of a given edge count.
 * Note: radius and length must not conflict.
 *
 * @param {Object} [options] - options for construction
 * @param {Integer} [options.sides=32] - how many sides the polygon has.
 * @returns {PointArray} Array of points along the path of the circle in CCW winding.
 *
 * @example
 * const circlePoints = regularPolygon(32)
 *
 * @example
 * const squarePoints = regularPolygon(4)
 * })
 */
const buildRegularPolygonImpl = (sides = 32) => {
  let points = [];
  for (let i = 0; i < sides; i++) {
    let radians = (2 * Math.PI * i) / sides;
    let [x, y] = fromAngleRadians(radians);
    points.push([x, y, 0]);
  }
  points.isConvex = true;
  // FIX: Clean up the consumers of this result.
  const z0Surface = { z0Surface: [points] };
  return z0Surface;
};

export const buildRegularPolygon = cache(buildRegularPolygonImpl);
