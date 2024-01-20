import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import { rotateX, rotateY, rotateZ } from './rotate.js';

import { Group } from './Group.js';
import { Point } from './Point.js';
import { as } from './tag.js';
import { hasTypeReference } from './tagged/type.js';
import { transform } from './transform.js';
import { translate } from './translate.js';

export const Ref = (name, nx = 0, ny = 0, nz = 1, coordinate) => {
  let x = 0;
  let y = 0;
  let z = 0;
  if (coordinate) {
    [x = 0, y = 0, z = 0, nx = 0, ny = 0, nz = 1] = coordinate;
  }
  // Disorient the point as though the source of a segment.
  const inverse = fromSegmentToInverseTransform(
    [
      [x, y, z],
      [x + nx, y + ny, z + nz],
    ],
    [0, 0, 1]
  );
  const matrix = invertTransform(inverse);
  const point = Point(0, 0, 0);
  const content = name ? as(point, [name]) : point;
  return hasTypeReference(transform(content, matrix));
};

export const ref = (geometry, name) => transform(Ref(name), geometry.matrix);

const orZero = (v) => (v.length === 0 ? [0] : v);

export const X = (xs) =>
  Group(
    orZero(xs).map((x) =>
      ref(translate(rotateY(Point(0, 0, 0), -1 / 4), [x, 0, 0]))
    )
  );
export const Y = (ys) =>
  Group(
    orZero(ys).map((y) =>
      ref(translate(rotateX(Point(0, 0, 0), -1 / 4), [0, y, 0]))
    )
  );
export const Z = (zs) =>
  Group(orZero(zs).map((z) => ref(translate(Point(0, 0, 0), [0, 0, z]))));

export const YZ = (xs) =>
  Group(
    orZero(xs).map((x) =>
      ref(translate(rotateY(Point(0, 0, 0), -1 / 4), [x, 0, 0]))
    )
  );
export const XZ = (ys) =>
  Group(
    orZero(ys).map((y) =>
      ref(translate(rotateX(Point(0, 0, 0), -1 / 4), [0, y, 0]))
    )
  );
export const XY = (zs) =>
  Group(orZero(zs).map((z) => ref(translate(Point(0, 0, 0), [0, 0, z]))));

export const ZY = (xs) =>
  Group(
    orZero(xs).map((x) =>
      ref(translate(rotateY(Point(0, 0, 0), 1 / 4), [-x, 0, 0]))
    )
  );
export const ZX = (ys) =>
  Group(
    orZero(ys).map((y) =>
      ref(translate(rotateX(Point(0, 0, 0), 1 / 4), [0, -y, 0]))
    )
  );
export const YX = (zs) =>
  Group(
    orZero(zs).map((z) =>
      ref(translate(rotateX(Point(0, 0, 0), 1 / 2), [0, 0, -z]))
    )
  );

// export const X = (x) => translateXs(Ref(undefined, 1, 0, 0), orZero(x));
// export const Y = (y) => translateYs(Ref(undefined, 0, 1, 0), orZero(y));
// export const Z = (z) => translateZs(Ref(undefined, 0, 0, 1), orZero(z));

// export const XY = (z) => translateZs(Ref(undefined, 0, 0, 1), orZero(z));
// export const YX = (z) => translateZs(Ref(undefined, 0, 0, -1), orZero(z));
// export const XZ = (y) => translateYs(Ref(undefined, 0, 1, 0), orZero(y));
// export const ZX = (y) => translateYs(Ref(undefined, 0, -1, 0), orZero(y));
// export const YZ = (x) => translateXs(Ref(undefined, 1, 0, 0), orZero(x));
// export const ZY = (x) => translateXs(Ref(undefined, -1, 0, 0), orZero(x));

export const RX = (ts) =>
  Group(orZero(ts).map((t) => ref(rotateX(Point(0, 0, 0), t))));
export const RY = (ts) =>
  Group(orZero(ts).map((t) => ref(rotateY(Point(0, 0, 0), t))));
export const RZ = (ts) =>
  Group(orZero(ts).map((t) => ref(rotateZ(Point(0, 0, 0), t))));
