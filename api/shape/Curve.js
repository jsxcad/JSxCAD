import { CurveInterpolator } from 'curve-interpolator';
import Link from './Link.js';
import Loop from './Loop.js';
import Point from './Point.js';
import Shape from './Shape.js';

export const Curve = Shape.registerMethod2(
  'Curve',
  ['coordinates', 'number', 'options', 'modes:closed'],
  (coordinates, implicitSteps = 20, { steps = implicitSteps } = {}, { closed }) => {
    const interpolator = new CurveInterpolator(coordinates, {
      closed,
      tension: 0.2,
      alpha: 0.5,
    });
    const points = interpolator.getPoints(steps);
    if (closed) {
      return Loop(...points.map((point) => Point(point)));
    } else {
      return Link(...points.map((point) => Point(point)));
    }
  }
);

export const curve = Shape.registerMethod2(
  'curve',
  ['input', 'rest'],
  (input, rest) => Curve(input, ...rest)
);
