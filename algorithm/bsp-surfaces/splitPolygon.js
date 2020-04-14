import { equals as equalsPlane, splitLineSegmentByPlane } from '@jsxcad/math-plane';
// import { equals as equalsPoint, subtract } from '@jsxcad/math-vec3';

import { pushWhenValid } from '@jsxcad/geometry-polygons';
import { subtract } from '@jsxcad/math-vec3';
import { toPlane } from '@jsxcad/math-poly3';

const EPSILON = 1e-5;
// const EPSILON2 = 1e-10;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const COPLANAR_FRONT = 4;
const COPLANAR_BACK = 5;

export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

//  dot(plane, point) - plane[W];
export const planeDistance = (plane, point) =>
  plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];

// const toType = (plane, point) => {
//   // const t = planeDistance(plane, point);
//   const t = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];
//   if (t < -EPSILON) {
//     return BACK;
//   } else if (t > EPSILON) {
//     return FRONT;
//   } else {
//     return COPLANAR;
//   }
// };

const pointType = [];

const splitConcave = (normalize, plane, points, polygonPlane, back, front) => {
  const buildList = (points) => {
    const nodes = [];
    let head = null;
    let tail = null;
    const addLink = (point, type, next = null, link = null, visited = false) => {
      const node = { point, type, next, link, visited };
      if (head === null) {
        head = node;
        head.next = head;
      } else {
        tail.next = node;
      }
      nodes.push(node);
      tail = node;
      tail.next = head;
    };
    for (let index = 0; index < points.length; index++) {
      addLink(points[index], pointType[index]);
    }
    return nodes;
  };

  const orderSpans = (spans) => {
    const trendVector = subtract(spans[0].point, spans[1].point);
    const trend = (point) => dot(point, trendVector);
    const orderByTrend = (a, b) => {
      const ta = trend(a.point);
      const tb = trend(b.point);
      return ta - tb;
    };
    spans.sort(orderByTrend);
    return spans;
  };

  const buildSpans = (head) => {
    const spans = [];
    let node = head;
    do {
      const next = node.next;
      if ((node.type === FRONT && next.type !== FRONT) ||
          (node.type !== FRONT && next.type === FRONT)) {
        // Interpolate a span-point.
        const spanPoint = normalize(splitLineSegmentByPlane(plane, node.point, next.point));
        const span = { point: spanPoint, type: COPLANAR, next, link: null, visited: true };
        node.next = span;
        // Remember the split for ordering.
        spans.push(span);
      }
      node = next;
    } while (node !== head);
    return orderSpans(spans);
  };

  const nodes = buildList(points);
  const spans = buildSpans(nodes[0]);
  const s = spans.slice();

  while (spans.length >= 2) {
    const a = spans.pop();
    const b = spans.pop();
    a.link = b;
    b.link = a;
  }

  for (const start of nodes) {
    if (start.visited === true) {
      continue;
    }

    const points = [];
    let node = start;
    let type = 0;
    do {
      node.visited = true;
      type |= node.type;
      points.push(node.point);
      if (node.link !== null) {
        node = node.link;
        points.push(node.point);
        node.visited = true;
      }
      node = node.next;
    } while (node !== start);
    if (type === FRONT) {
      pushWhenValid(front, points, polygonPlane);
    } else if (type === BACK) {
      pushWhenValid(back, points, polygonPlane);
    } else if (type !== COPLANAR) {
      // Coplanar loops are degenerate, so drop them.
      // Otherwise it's an error.
      throw Error('die');
    }
  }
};

const splitPolygon = (normalize, plane, polygon, back, abutting, overlapping, front) => {
  /*
    // This slows things down on average, probably due to not having the bounding sphere computed.
    // Check for non-intersection due to distance from the plane.
    const [center, radius] = measureBoundingSphere(polygon);
    let distance = planeDistance(plane, center) + EPSILON;
    if (distance > radius) {
      front.push(polygon);
      return;
    } else if (distance < -radius) {
      back.push(polygon);
      return;
    }
  */
  let polygonType = COPLANAR;
  const polygonPlane = toPlane(polygon);
  if (polygonPlane === undefined) {
    // Degenerate polygon
    return;
  }
  if (!equalsPlane(polygonPlane, plane)) {
    for (let nth = 0; nth < polygon.length; nth++) {
      // const type = toType(plane, polygon[nth]);
      // const t = planeDistance(plane, point);
      const point = polygon[nth];
      const t = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];
      if (t < -EPSILON) {
        polygonType |= BACK;
        pointType[nth] = BACK;
      } else if (t > EPSILON) {
        polygonType |= FRONT;
        pointType[nth] = FRONT;
      } else {
        polygonType |= COPLANAR;
        pointType[nth] = COPLANAR;
      }
    }
  }

  // Put the polygon in the correct list, splitting it when necessary.
  switch (polygonType) {
    case COPLANAR:
      if (dot(plane, polygonPlane) > 0) {
        // The plane and the polygon face the same way, so the spaces overlap.
        overlapping.push(polygon);
      } else {
        // The plane and the polygon face the opposite directions, so the spaces abut.
        abutting.push(polygon);
      }
      return;
    case FRONT:
      front.push(polygon);
      return;
    case BACK:
      back.push(polygon);
      return;
    case SPANNING: {
      const frontPoints = [];
      const backPoints = [];
      const spanPoints = [];

      const last = polygon.length - 1;
      let startPoint = polygon[last];
      let startType = pointType[last];
      for (let nth = 0; nth < polygon.length; nth++) {
        const endPoint = polygon[nth];
        const endType = pointType[nth];
        if (startType !== BACK) {
          // The inequality is important as it includes COPLANAR points.
          frontPoints.push(startPoint);
        }
        if (startType !== FRONT) {
          // The inequality is important as it includes COPLANAR points.
          backPoints.push(startPoint);
        }
        if ((startType | endType) === SPANNING) {
          // This should exclude COPLANAR points.
          // Compute the point that touches the splitting plane.
          const spanPoint = normalize(splitLineSegmentByPlane(plane, startPoint, endPoint));
          frontPoints.push(spanPoint);
          backPoints.push(spanPoint);
          spanPoints.push(spanPoint);
        }
        startPoint = endPoint;
        startType = endType;
      }
      if (spanPoints.length <= 2) {
        pushWhenValid(front, frontPoints, polygonPlane);
        pushWhenValid(back, backPoints, polygonPlane);
      } else {
        splitConcave(normalize, plane, polygon, polygonPlane, back, front);
      }
      /*
      if ((spans.length % 2) === 0) {
        throw Error('die: Even number of spans.');
      }
      if (spans.length > 3) {
        const trendVector = subtract(spans[0][SPAN_POINT], spans[1][SPAN_POINT]);
        const trend = (point) => dot(point, trendVector);
        spans.sort(([a], [b]) => a === null ? -1 : trend(a) - trend(b));
        // The order needs to be such that the span joins follow the winding
        // direction.
        for (let i = 0; i < spans; i++) {
          spans[i][BACK_SPAN] = spans[spans.length - i][BACK_SPAN_BACKWARD];
        }
        // Each span-pair is now an enter + exit, given the winding rule.
        // But not necessarily an enter + exit for the same contour.
        // We must re-arrange so that the contours are connected properly.
        // Check to split points.
        // Now the span points are sequenced.
        // Restitch the graph.
        while (spans.length > 0) {
          const exit = spans.pop();
          const enter = spans.pop();
          // Prepend the enter nodes to the exit nodes.
          enter[FRONT_SPAN].unshift(...exit[FRONT_SPAN]);
          enter[BACK_SPAN].unshift(...exit[BACK_SPAN]);
          if (spans.length > 0) {
            // If the enter ends with the next exit, join them up.
            const nextExit = tail(spans);
            if (equalsPoint(nextExit[SPAN_POINT], tail(enter[FRONT_SPAN]))) {
              nextExit[FRONT_SPAN].unshift(...enter[FRONT_SPAN]);
            } else {
              pushWhenValid(front, enter[FRONT_SPAN], polygonPlane);
            }
            if (equalsPoint(nextExit[SPAN_POINT], tail(enter[BACK_SPAN]))) {
              nextExit[BACK_SPAN].unshift(...enter[BACK_SPAN]);
            } else {
              pushWhenValid(back, enter[BACK_SPAN], polygonPlane);
            }
          } else {
            // These are the final spans, they cannot be deferred.
            pushWhenValid(front, enter[FRONT_SPAN], polygonPlane);
            pushWhenValid(back, enter[BACK_SPAN], polygonPlane);
          }
        }
      } else {
        pushWhenValid(front, spans[0][FRONT_SPAN], polygonPlane);
        pushWhenValid(back, spans[0][BACK_SPAN], polygonPlane);
      }
*/
      break;
    }
  }
};

export {
  BACK,
  COPLANAR_BACK,
  COPLANAR_FRONT,
  EPSILON,
  FRONT,
  splitPolygon
};
