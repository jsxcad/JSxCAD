import {
  getAngle,
  getAt,
  getCorner1,
  getCorner2,
  getFrom,
  getScale,
  getSides,
  getTo,
} from './Plan.js';

import Shape from './Shape.js';
import Spiral from './Spiral.js';
import { negate } from '@jsxcad/math-vec3';
import { taggedPlan } from '@jsxcad/geometry';

const Z = 2;

Shape.registerReifier('Arc', (geometry) => {
  let { start = 0, end = 1 } = getAngle(geometry);

  while (start > end) {
    start -= 1;
  }

  const [scale, middle] = getScale(geometry);
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  const top = corner2[Z];
  const bottom = corner1[Z];
  const step = 1 / getSides(geometry, 32);
  const steps = Math.ceil((end - start) / step);
  const effectiveStep = (end - start) / steps;

  // FIX: corner1 is not really right.
  if (end - start === 1) {
    return Spiral((a) => [[1]], {
      from: start - 1 / 4,
      upto: end - 1 / 4,
      by: effectiveStep,
    })
      .scale(...scale)
      .move(...middle)
      .close()
      .fill()
      .ex(top, bottom)
      .orient2({
        at: getAt(geometry),
        to: getTo(geometry),
      });
  } else {
    return Spiral((a) => [[1]], {
      from: start - 1 / 4,
      to: end - 1 / 4,
      by: effectiveStep,
    })
      .scale(...scale)
      .move(...middle)
      .op((s) => (top !== bottom ? s.close().fill().ex(top, bottom) : s))
      .orient2({
        center: negate(getAt(geometry)),
        from: getFrom(geometry),
        at: getTo(geometry),
      });
  }
});

export const Arc = (x = 1, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Arc' })).hasDiameter(x, y, z);

Shape.prototype.Arc = Shape.shapeMethod(Arc);

export default Arc;
