import Shape from '@jsxcad/api-v1-shape';

export const fromPoints = (...points) => Shape.fromOpenPath(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

/**
 *
 * # Path
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Path([0, 1],
 *      [1, 1],
 *      [1, 0],
 *      [0.2, 0.2])
 * ```
 * :::
 *
 **/

export const Path = (...points) => fromPoints(...points);
Path.fromPoints = fromPoints;

Path.signature = 'Path(...points:Point) -> Shape';
Path.fromPoints.signature = 'Path.fromPoints(...points:Point) -> Shape';

export default Path;
