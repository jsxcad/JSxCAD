import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import bSpline from 'b-spline';
import { destructure2 } from './destructure.js';

export const Curve = Shape.registerMethod(
  'Curve',
  (...args) =>
    async (shape) => {
      const [coordinates, implicitSteps = 20, options] = await destructure2(
        shape,
        args,
        'coordinates',
        'number',
        'options'
      );
      const { steps = implicitSteps } = options;
      const points = [];
      for (let t = 0; t <= steps; t++) {
        points.push(bSpline(t / steps, 2, coordinates));
      }
      return Link(...points.map((point) => Point(point)));
    }
);
