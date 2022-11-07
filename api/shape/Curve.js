import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import bezier from 'adaptive-bezier-curve';
import { getZag } from './Plan.js';
import { taggedPlan } from '@jsxcad/geometry';

const DEFAULT_CURVE_ZAG = 1;

export const reifyCurve = (plan) => {
  const { controlPoints } = plan.toGeometry().plan;
  const { start, c1, c2, end } = controlPoints;
  const p1 = Shape.toCoordinate(undefined, start);
  const p2 = Shape.toCoordinate(undefined, c1);
  const p3 = Shape.toCoordinate(undefined, c2);
  const p4 = Shape.toCoordinate(undefined, end);
  const zag = getZag(plan.toGeometry(), DEFAULT_CURVE_ZAG);
  const points = bezier(p1, p2, p3, p4, 10 / zag);
  return Link(points.map((point) => Point(point)));
};

// Shape.registerReifier('Curve', reifyCurve);

export const Curve = (start, c1, c2, end) =>
  reifyCurve(
  Shape.fromGeometry(
    taggedPlan({}, { type: 'Curve', controlPoints: { start, c1, c2, end } })
  ));
