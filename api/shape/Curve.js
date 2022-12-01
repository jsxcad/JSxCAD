import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import bezier from 'adaptive-bezier-curve';
import { destructure2 } from './destructure.js';

const DEFAULT_CURVE_ZAG = 1;

export const Curve = Shape.registerShapeMethod('Curve', async (...args) => {
  const [options, coordinates] = await destructure2(
    null,
    args,
    'objects',
    'coordinates'
  );
  const [start, c1, c2, end] = coordinates;
  const { zag = DEFAULT_CURVE_ZAG } = options;
  const points = bezier(start, c1, c2, end, 10 / zag);
  return Link(points.map((point) => Point(point)));
});
