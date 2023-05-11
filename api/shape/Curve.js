import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import bSpline from 'b-spline';
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
      let maxT = 1;
      if (modes.includes('closed')) {
        maxT = 1 - 1 / (coordinates.length + 1);
        coordinates.push(...coordinates.slice(0, 3));
      }
      const points = [];
      for (let t = 0; t <= maxT; t += 1 / steps) {
        points.push(bSpline(t, 2, coordinates));
      }
      return Link(...points.map((point) => Point(point)));
    }
);
