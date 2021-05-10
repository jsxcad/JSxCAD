import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  getAngle,
  getAt,
  getCorner1,
  getCorner2,
  getFrom,
  getMatrix,
  getScale,
  getSides,
  getTo,
} from './plan.js';
import { registerReifier, taggedPlan } from '@jsxcad/geometry-tagged';

import Spiral from './Spiral.js';
import { negate } from '@jsxcad/math-vec3';

const Z = 2;

registerReifier('Arc', ({ tags, plan }) => {
  let { start = 0, end = 360 } = getAngle(plan);
  const [scale, middle] = getScale(plan);
  const corner1 = getCorner1(plan);
  const corner2 = getCorner2(plan);
  const top = corner2[Z];
  const bottom = corner1[Z];
  const step = 360 / getSides(plan, 32);
  const steps = Math.ceil((end - start) / step);
  const effectiveStep = (end - start) / steps;

  // FIX: corner1 is not really right.
  if (end - start === 360) {
    return Spiral((a) => [[1]], {
      from: start - 90,
      upto: end - 90,
      by: effectiveStep,
    })
      .scale(...scale)
      .move(...middle)
      .close()
      .fill()
      .ex(top, bottom)
      .orient({
        center: negate(getAt(plan)),
        from: getFrom(plan),
        at: getTo(plan),
      })
      .transform(getMatrix(plan))
      .setTags(tags)
      .toGeometry();
  } else {
    return Spiral((a) => [[1]], {
      from: start - 90,
      to: end - 90,
      by: effectiveStep,
    })
      .scale(...scale)
      .move(...middle)
      .move(...getAt(plan))
      .transform(getMatrix(plan))
      .setTags(tags)
      .toGeometry();
  }
});

export const Arc = (x = 1, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Arc' })).diameter(x, y, z);

Shape.prototype.Arc = shapeMethod(Arc);

export default Arc;
