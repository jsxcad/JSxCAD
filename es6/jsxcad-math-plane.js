import { reallyQuantizeForSpace } from './jsxcad-math-utils.js';
import { unit, dot, subtract, cross, length, random, scale, add, multiply, fromScalar, transform as transform$1 } from './jsxcad-math-vec3.js';
import { fromValues, isMirroring } from './jsxcad-math-mat4.js';

const canonicalize = ([x = 0, y = 0, z = 0, w = 0]) => [reallyQuantizeForSpace(x), reallyQuantizeForSpace(y), reallyQuantizeForSpace(z), reallyQuantizeForSpace(w)];

/**
 * Compare the given planes for equality
 * @return {boolean} true if planes are equal
 */
const equals = (a, b) =>
  (a[0] === b[0]) &&
  (a[1] === b[1]) &&
  (a[2] === b[2]) &&
  (a[3] === b[3]);

/**
 * Flip the given plane (vec4)
 *
 * @param {vec4} vec - plane to flip
 * @return {vec4} flipped plane
 */
const flip = ([x = 0, y = 0, z = 0, w = 0]) => [-x, -y, -z, -w];

/**
 * Create a new plane from the given normal and point values
 * @param {Vec3} normal  - vector 3D
 * @param {Vec3}  point- vector 3D
 * @returns {Array} a new plane with properly typed values
 */
const fromNormalAndPoint = (normal, point) => {
  const u = unit(normal);
  const w = dot(point, u);
  return [u[0], u[1], u[2], w];
};

/**
 * Create a new plane from the given points
 *
 * @param {Vec3} a - 3D point
 * @param {Vec3} b - 3D point
 * @param {Vec3} c - 3D point
 * @returns {Vec4} a new plane with properly typed values
 */
const fromPoints = (a, b, c) => {
  // let n = b.minus(a).cross(c.minus(a)).unit()
  // FIXME optimize later
  const ba = subtract(b, a);
  const ca = subtract(c, a);
  const cr = cross(ba, ca);
  const normal = unit(cr); // normal part
  //
  const w = dot(normal, a);
  return [normal[0], normal[1], normal[2], w];
};

const EPS = 1e-5;

/** Create a new plane from the given points like fromPoints,
 * but allow the vectors to be on one point or one line
 * in such a case a random plane through the given points is constructed
 * @param {Vec3} a - 3D point
 * @param {Vec3} b - 3D point
 * @param {Vec3} c - 3D point
 * @returns {Vec4} a new plane with properly typed values
 */
const fromPointsRandom = (a, b, c) => {
  let v1 = subtract(b, a);
  let v2 = subtract(c, a);
  if (length(v1) < EPS) {
    v1 = random(v2);
  }
  if (length(v2) < EPS) {
    v2 = random(v1);
  }
  let normal = cross(v1, v2);
  if (length(normal) < EPS) {
    // this would mean that v1 == v2.negated()
    v2 = random(v1);
    normal = cross(v1, v2);
  }
  normal = unit(normal);
  return fromValues(normal[0], normal[1], normal[2], dot(normal, a));
};

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

// Newell's method for computing the plane of a polygon.
const fromPolygon = (polygon) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  let lastPoint = polygon[polygon.length - 1];
  for (const thisPoint of polygon) {
    normal[X] += (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z] + thisPoint[Z]);
    normal[Y] += (lastPoint[Z] - thisPoint[Z]) * (lastPoint[X] + thisPoint[X]);
    normal[Z] += (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
    reference[X] += lastPoint[X];
    reference[Y] += lastPoint[Y];
    reference[Z] += lastPoint[Z];
    lastPoint = thisPoint;
  }
  const factor = 1 / length(normal);
  const plane = scale(factor, normal);
  plane[W] = dot(reference, normal) * factor / polygon.length;
  if (isNaN(plane[X])) {
    return undefined;
  } else {
    return plane;
  }
};

const W$1 = 3;

/**
 * Calculate the distance to the given point
 * @return {Number} signed distance to point
 */
const signedDistanceToPoint = (plane, point) => dot(plane, point) - plane[W$1];

/**
 * Split the given line by the given plane.
 * Robust splitting, even if the line is parallel to the plane
 * @return {vec3} a new point
 */
const splitLineSegmentByPlane = (plane, p1, p2) => {
  const direction = subtract(p2, p1);
  let lambda = (plane[3] - dot(plane, p1)) / dot(plane, direction);
  if (Number.isNaN(lambda)) lambda = 0;
  if (lambda > 1) lambda = 1;
  if (lambda < 0) lambda = 0;
  return add(p1, scale(lambda, direction));
};

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;
const W$2 = 3;

const toXYPlaneTransforms = (plane, rightVector) => {
  if (plane === undefined) {
    throw Error('die');
  }
  if (rightVector === undefined) {
    rightVector = random(plane);
  }

  const v = unit(cross(plane, rightVector));
  const u = cross(v, plane);
  const p = multiply(plane, fromScalar(plane[W$2]));

  const to = fromValues(u[X$1], v[X$1], plane[X$1], 0,
                        u[Y$1], v[Y$1], plane[Y$1], 0,
                        u[Z$1], v[Z$1], plane[Z$1], 0,
                        0, 0, -plane[W$2], 1);

  const from = fromValues(u[X$1], u[Y$1], u[Z$1], 0,
                          v[X$1], v[Y$1], v[Z$1], 0,
                          plane[X$1], plane[Y$1], plane[Z$1], 0,
                          p[X$1], p[Y$1], p[Z$1], 1);

  return [to, from];
};

/**
 * Transform the given plane using the given matrix
 * @return {Array} a new plane with properly typed values
 */
const transform = (matrix, plane) => {
  const ismirror = isMirroring(matrix);
  // get two vectors in the plane:
  const r = random(plane);
  const u = cross(plane, r);
  const v = cross(plane, u);
  // get 3 points in the plane:
  let point1 = multiply(plane, [plane[3], plane[3], plane[3]]);
  let point2 = add(point1, u);
  let point3 = add(point1, v);
  // transform the points:
  point1 = transform$1(matrix, point1);
  point2 = transform$1(matrix, point2);
  point3 = transform$1(matrix, point3);
  // and create a new plane from the transformed points:
  let newplane = fromPoints(point1, point2, point3);
  if (ismirror) {
    // the transform is mirroring so mirror the plane
    newplane = flip(newplane);
  }
  return newplane;
};

export { canonicalize, equals, flip, fromNormalAndPoint, fromPoints, fromPointsRandom, fromPolygon, signedDistanceToPoint, splitLineSegmentByPlane, toXYPlaneTransforms, transform };
