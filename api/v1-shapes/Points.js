import Shape from '@jsxcad/api-v1-shape';

export const fromPoints = (...args) => Shape.fromPoints(args);

/**
 *
 * # Points
 *
 * Generates point cloud.
 *
 * Note: The points are not visible in the illustrations below.
 *
 * ::: illustration
 * ```
 * Points([ -0.5, -0.5, -0.5 ],
 *        [ -0.5, -0.5, 0.5 ],
 *        [ -0.5, 0.5, -0.5 ],
 *        [ -0.5, 0.5, 0.5 ],
 *        [ 0.5, -0.5, -0.5 ],
 *        [ 0.5, -0.5, 0.5 ],
 *        [ 0.5, 0.5, -0.5 ],
 *        [ 0.5, 0.5, 0.5 ])
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * hull(Points([ -0.5, -0.5, -0.5 ],
 *             [ -0.5, -0.5, 0.5 ],
 *             [ -0.5, 0.5, -0.5 ],
 *             [ -0.5, 0.5, 0.5 ],
 *             [ 0.5, -0.5, -0.5 ],
 *             [ 0.5, -0.5, 0.5 ],
 *             [ 0.5, 0.5, -0.5 ],
 *             [ 0.5, 0.5, 0.5 ]))
 * ```
 * :::
 *
 **/

export const Points = (...args) => fromPoints(...args);
Points.fromPoints = fromPoints;

export default Points;
