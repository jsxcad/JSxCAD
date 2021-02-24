import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  getAt,
  getCorner1,
  getCorner2,
  getFrom,
  getMatrix,
  getSides,
  getTo,
} from './plan.js';
import { registerReifier, taggedPlan } from '@jsxcad/geometry-tagged';

import Arc from './Arc.js';
import Hull from './Hull.js';
import Point from './Point.js';
import { negate } from '@jsxcad/math-vec3';

const Z = 2;

// FIX: This looks wrong.
registerReifier('Cone', ({ tags, plan }) =>
  Hull(
    Arc(...getCorner2(plan)).sides(getSides(plan, 32)),
    Point(0, 0, getCorner1(plan)[Z])
  )
    .orient({
      center: negate(getAt(plan)),
      from: getFrom(plan),
      at: getTo(plan),
    })
    .transform(getMatrix(plan))
    .setTags(tags)
    .toGeometry()
);

export const Cone = (diameter = 1, top = 1, base = -top) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Cone' }))
    .corner1(0, 0, top)
    .corner2(diameter, diameter, base);

Shape.prototype.Cone = shapeMethod(Cone);

export default Cone;
