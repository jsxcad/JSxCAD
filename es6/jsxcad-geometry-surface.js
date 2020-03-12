import { canonicalize as canonicalize$1, transform as transform$2, toPlane as toPlane$1, flip as flip$1, isConvex, measureArea as measureArea$1 } from './jsxcad-math-poly3.js';
import { fromTranslation, fromZRotation, fromScaling } from './jsxcad-math-mat4.js';
import { subtract, scale as scale$1, dot, add, distance } from './jsxcad-math-vec3.js';
import { equals, splitLineSegmentByPlane, signedDistanceToPoint, toXYPlaneTransforms } from './jsxcad-math-plane.js';
import { cacheCut, cacheTransform } from './jsxcad-cache.js';
import { assertUnique } from './jsxcad-geometry-path.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { makeConvex as makeConvex$1, retessellate as retessellate$1 } from './jsxcad-geometry-z0surface.js';
import { union, outline as outline$1 } from './jsxcad-geometry-z0surface-boolean.js';

// export const toPlane = (surface) => toPlaneOfPolygon(surface[0]);
const canonicalize = (surface) => surface.map(canonicalize$1);

// Transforms
const transform = (matrix, surface) => surface.map(polygon => transform$2(matrix, polygon));
const translate = (vector, surface) => transform(fromTranslation(vector), surface);
const rotateZ = (angle, surface) => transform(fromZRotation(angle), surface);
const scale = (vector, surface) => transform(fromScaling(vector), surface);

// FIX: This is incorrect, since it assumes the first non-degenerate polygon is representative.

const toPlane = (surface) => {
  if (surface.plane !== undefined) {
    return surface.plane;
  } else {
    for (const polygon of surface) {
      const plane = toPlane$1(polygon);
      if (plane !== undefined) {
        surface.plane = plane;
        return surface.plane;
      }
    }
  }
};

const EPSILON = 1e-5;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const toType = (plane, point) => {
  let t = signedDistanceToPoint(plane, point);
  if (t < -EPSILON) {
    return BACK;
  } else if (t > EPSILON) {
    return FRONT;
  } else {
    return COPLANAR;
  }
};

const pointType = [];

const cutSurface = (plane, coplanarFrontSurfaces, coplanarBackSurfaces, frontSurfaces, backSurfaces, frontEdges, backEdges, surface) => {
  const surfacePlane = toPlane(surface);
  if (surfacePlane === undefined) {
    // Degenerate.
    return;
  }
  let coplanarFrontPolygons;
  let coplanarBackPolygons;
  let frontPolygons;
  let backPolygons;
  for (let polygon of surface) {
    pointType.length = 0;
    let polygonType = COPLANAR;
    if (!equals(surfacePlane, plane)) {
      for (const point of polygon) {
        const type = toType(plane, point);
        polygonType |= type;
        pointType.push(type);
      }
    }

    // Put the polygon in the correct list, splitting it when necessary.
    switch (polygonType) {
      case COPLANAR: {
        if (dot(plane, surfacePlane) > 0) {
          if (coplanarFrontPolygons === undefined) {
            coplanarFrontPolygons = [];
          }
          coplanarFrontPolygons.push(polygon);
        } else {
          if (coplanarBackPolygons === undefined) {
            coplanarBackPolygons = [];
          }
          coplanarBackPolygons.push(polygon);
        }
        break;
      }
      case FRONT: {
        if (frontPolygons === undefined) {
          frontPolygons = [];
        }
        frontPolygons.push(polygon);
        let startPoint = polygon[polygon.length - 1];
        let startType = pointType[polygon.length - 1];
        for (let nth = 0; nth < polygon.length; nth++) {
          const endPoint = polygon[nth];
          const endType = pointType[nth];
          if (startType === COPLANAR && endType === COPLANAR) {
            frontEdges.push([startPoint, endPoint]);
          }
          startPoint = endPoint;
          startType = endType;
        }
        break;
      }
      case BACK: {
        if (backPolygons === undefined) {
          backPolygons = [];
        }
        backPolygons.push(polygon);
        let startPoint = polygon[polygon.length - 1];
        let startType = pointType[polygon.length - 1];
        for (let nth = 0; nth < polygon.length; nth++) {
          const endPoint = polygon[nth];
          const endType = pointType[nth];
          if (startType === COPLANAR && endType === COPLANAR) {
            backEdges.push([startPoint, endPoint]);
          }
          startPoint = endPoint;
          startType = endType;
        }
        break;
      }
      case SPANNING: {
        // Make a local copy so that mutation does not propagate.
        polygon = polygon.slice();
        let backPoints = [];
        let frontPoints = [];
        // Add the colinear spanning point to the polygon.
        {
          let last = polygon.length - 1;
          for (let current = 0; current < polygon.length; last = current++) {
            const lastType = pointType[last];
            const lastPoint = polygon[last];
            if ((lastType | pointType[current]) === SPANNING) {
              // Break spanning segments at the point of intersection.
              const rawSpanPoint = splitLineSegmentByPlane(plane, lastPoint, polygon[current]);
              const spanPoint = subtract(rawSpanPoint, scale$1(signedDistanceToPoint(surfacePlane, rawSpanPoint), plane));
              // Note: Destructive modification of polygon here.
              polygon.splice(current, 0, spanPoint);
              pointType.splice(current, 0, COPLANAR);
            }
          }
        }
        // Spanning points have been inserted.
        {
          let last = polygon.length - 1;
          let lastCoplanar = polygon[pointType.lastIndexOf(COPLANAR)];
          for (let current = 0; current < polygon.length; last = current++) {
            const point = polygon[current];
            const type = pointType[current];
            const lastType = pointType[last];
            const lastPoint = polygon[last];
            if (type !== FRONT) {
              backPoints.push(point);
            }
            if (type !== BACK) {
              frontPoints.push(point);
            }
            if (type === COPLANAR) {
              if (lastType === COPLANAR) {
                frontEdges.push([lastPoint, point]);
                backEdges.push([lastPoint, point]);
              } else if (lastType === BACK) {
                frontEdges.push([lastCoplanar, point]);
              } else if (lastType === FRONT) {
                backEdges.push([lastCoplanar, point]);
              }
              lastCoplanar = point;
            }
          }
        }
        if (frontPoints.length >= 3) {
        // Add the polygon that sticks out the front of the plane.
          if (frontPolygons === undefined) {
            frontPolygons = [];
          }
          frontPolygons.push(frontPoints);
        }
        if (backPoints.length >= 3) {
        // Add the polygon that sticks out the back of the plane.
          if (backPolygons === undefined) {
            backPolygons = [];
          }
          backPolygons.push(backPoints);
        }
        break;
      }
    }
  }
  if (coplanarFrontPolygons !== undefined) {
    coplanarFrontSurfaces.push(coplanarFrontPolygons);
  }
  if (coplanarBackPolygons !== undefined) {
    coplanarBackSurfaces.push(coplanarBackPolygons);
  }
  if (frontPolygons !== undefined) {
    frontSurfaces.push(frontPolygons);
  }
  if (backPolygons !== undefined) {
    backSurfaces.push(backPolygons);
  }
};

const cutImpl = (planeSurface, surface) => {
  const front = [];
  const back = [];
  const frontEdges = [];
  const backEdges = [];

  cutSurface(toPlane(planeSurface), front, back, front, back, frontEdges, backEdges, surface);
  if (frontEdges.some(edge => edge[1] === undefined)) {
    throw Error(`die/end/missing: ${JSON.stringify(frontEdges)}`);
  }

  return [].concat(...back);
};

const cut = cacheCut(cutImpl);

// import { isCoplanar } from './jsxcad-math-poly3.js';
//
// const assertCoplanarPolygon = (polygon) => {
//   // Disabled
//   //
//   // if (!isCoplanar(polygon)) {
//   //   throw Error(`die`);
//   // }
// };

const assertCoplanar = (surface) => {
  // Disabled
  //
  // for (const polygon of surface) {
  //  assertCoplanarPolygon(polygon);
  // }
};

const assertGood = (surface) => {
  for (const path of surface) {
    assertUnique(path);
    if (toPlane$1(path) === undefined) {
      console.log(`QQ/path: ${JSON.stringify(path)}`);
      throw Error('die');
    }
  }
};

const eachPoint = (thunk, surface) => {
  for (const polygon of surface) {
    for (const [x = 0, y = 0, z = 0] of polygon) {
      thunk([x, y, z]);
    }
  }
};

/**
 * Transforms each polygon of the surface.
 *
 * @param {Polygons} original - the Polygons to transform.
 * @param {Function} [transform=identity] - function used to transform the polygons.
 * @returns {Polygons} a copy with transformed polygons.
 */
const map = (original, transform) => {
  if (original === undefined) {
    original = [];
  }
  if (transform === undefined) {
    transform = _ => _;
  }
  return original.map(polygon => transform(polygon));
};

const flip = (surface) => map(surface, flip$1);

// Cut the corners to produce triangles.
const triangulateConvexPolygon = (polygon) => {
  const surface = [];
  for (let i = 2; i < polygon.length; i++) {
    surface.push([polygon[0], polygon[i - 1], polygon[i]]);
  }
  return surface;
};

const makeConvex = (surface, normalize3 = createNormalize3(), plane) => {
  if (surface.length === undefined) {
    throw Error('die');
  }
  if (surface.length === 0) {
    // An empty surface is not non-convex.
    return surface;
  }
  if (surface.length === 1) {
    const polygon = surface[0];
    if (polygon.length === 3) {
      // A triangle is already convex.
      return surface;
    }
    if (polygon.length > 3 && isConvex(polygon)) {
      return triangulateConvexPolygon(polygon.map(normalize3));
    }
  }
  if (plane === undefined) {
    plane = toPlane(surface);
    if (plane === undefined) {
      return [];
    }
  }
  const [to, from] = toXYPlaneTransforms(plane);
  const z0Surface = transform(to, surface.map(path => path.map(normalize3)));
  const convexZ0Surface = makeConvex$1(z0Surface);
  const convexSurface = transform(from, convexZ0Surface).map(path => path.map(normalize3));
  return convexSurface;
};

const fromPolygons = ({ plane }, polygons) => makeConvex(polygons);

const makeSimple = (options = {}, surface) => {
  const [to, from] = toXYPlaneTransforms(toPlane(surface));
  let simpleSurface = union(...transform(to, surface).map(polygon => [polygon]));
  return transform(from, simpleSurface);
};

const measureArea = (surface) => {
  // CHECK: That this handles negative area properly.
  let total = 0;
  for (const polygon of surface) {
    total += measureArea$1(polygon);
  }
  return total;
};

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = (surface) => {
  if (surface.measureBoundingBox === undefined) {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (const path of surface) {
      for (const point of path) {
        if (point[0] < min[0]) min[0] = point[0];
        if (point[1] < min[1]) min[1] = point[1];
        if (point[2] < min[2]) min[2] = point[2];
        if (point[0] > max[0]) max[0] = point[0];
        if (point[1] > max[1]) max[1] = point[1];
        if (point[2] > max[2]) max[2] = point[2];
      }
    }
    surface.measureBoundingBox = [min, max];
  }
  return surface.measureBoundingBox;
};

const measureBoundingSphere = (surface) => {
  if (surface.measureBoundingSphere === undefined) {
    const box = measureBoundingBox(surface);
    const center = scale$1(0.5, add(box[0], box[1]));
    const radius = distance(center, box[1]);
    surface.measureBoundingSphere = [center, radius];
  }
  return surface.measureBoundingSphere;
};

const transformImpl = (matrix, polygons) => polygons.map(polygon => transform$2(matrix, polygon));

const transform$1 = cacheTransform(transformImpl);

const outline = (surface, normalize = createNormalize3(), plane = toPlane(surface)) => {
  if (plane === undefined) {
    return [];
  }
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(plane);
  const z0Surface = transform$1(toZ0, surface.map(path => path.map(normalize)));
  const outlinedZ0Surface = outline$1(z0Surface, normalize);
  return transform$1(fromZ0, outlinedZ0Surface).map(path => path.map(normalize));
};

const toGeneric = (surface) => surface.map(path => path.map(point => [...point]));

const toPoints = (surface) => {
  const points = [];
  eachPoint(point => points.push(point), surface);
  return points;
};

const toPolygons = (options = {}, surface) => surface;

const retessellate = (surface, normalize3 = createNormalize3(), plane) => {
  if (surface.length < 2) {
    return surface;
  }
  if (plane === undefined) {
    plane = toPlane(surface);
    if (plane === undefined) {
      return [];
    }
  }
  const [toZ0, fromZ0] = toXYPlaneTransforms(plane);
  const z0Surface = transform$1(toZ0, surface.map(path => path.map(normalize3)));
  const retessellated = retessellate$1(z0Surface);
  return transform$1(fromZ0, retessellated).map(path => path.map(normalize3));
};

export { assertCoplanar, assertGood, canonicalize, cut, cutSurface, eachPoint, flip, fromPolygons, makeConvex, makeSimple, measureArea, measureBoundingBox, measureBoundingSphere, outline, retessellate, rotateZ, scale, toGeneric, toPlane, toPoints, toPolygons, transform, translate };
