import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import bezier from 'adaptive-bezier-curve';
import { destructure } from './destructure.js';
import { toCoordinate } from './toCoordinate.js';

const DEFAULT_CURVE_ZAG = 1;

export const reifyCurve = async (start, c1, c2, end, zag) => {
  const p1 = await toCoordinate(undefined, start)(null);
  const p2 = await toCoordinate(undefined, c1)(null);
  const p3 = await toCoordinate(undefined, c2)(null);
  const p4 = await toCoordinate(undefined, end)(null);
  const points = bezier(p1, p2, p3, p4, 10 / zag);
  return Link(points.map((point) => Point(point)));
};

// Shape.registerReifier('Curve', reifyCurve);

export const Curve = Shape.registerShapeMethod('Curve', async (...args) => {
  const { values, objects: options } = destructure(args);
  const [start, c1, c2, end] = values;
  const { zag = DEFAULT_CURVE_ZAG } = options;
  return reifyCurve(start, c1, c2, end, zag);
});
