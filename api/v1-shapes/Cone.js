import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  getBase,
  getCenter,
  getDiameter,
  getFrom,
  getMatrix,
  getSides,
  getTo,
  getTop,
} from '@jsxcad/geometry-plan';
import { reify, taggedPlan } from '@jsxcad/geometry-tagged';

import Arc from './Arc.js';
import Hull from './Hull.js';
import Point from './Point.js';

reify.Cone = (plan) => {
  const [length, width] = getDiameter(plan);
  return Hull(
    Arc(length, width).sides(getSides(plan)).z(getBase(plan)),
    Point(0, 0, getTop(plan))
  )
    .orient({ center: getCenter(plan), from: getFrom(plan), at: getTo(plan) })
    .transform(getMatrix(plan))
    .toGeometry();
};

export const Cone = (diameter = 1, top = 1, base = 0) =>
  Shape.fromGeometry(
    taggedPlan({}, { diameter: [diameter, diameter, 0], type: 'Cone' })
  )
    .top(top)
    .base(base);

Shape.prototype.Cone = shapeMethod(Cone);

export default Cone;
