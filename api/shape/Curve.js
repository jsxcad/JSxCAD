import { CurveInterpolator } from 'curve-interpolator';
import Link from './Link.js';
import Loop from './Loop.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

export const Curve = Shape.registerMethod(
  'Curve',
  (...args) =>
    async (shape) => {
      const [coordinates, implicitSteps = 20, options, modes] =
        await destructure2(
          shape,
          args,
          'coordinates',
          'number',
          'options',
          'modes'
        );
      const { steps = implicitSteps } = options;
      const isClosed = modes.includes('closed');
      const interpolator = new CurveInterpolator(coordinates, {
        closed: isClosed,
        tension: 0.2,
        alpha: 0.5,
      });
      const points = interpolator.getPoints(steps);
      if (isClosed) {
        return Loop(...points.map((point) => Point(point)));
      } else {
        return Link(...points.map((point) => Point(point)));
      }
    }
);

export const curve = Shape.registerMethod(
  'curve',
  (...args) =>
    async (shape) =>
      Curve(shape, ...args)
);
