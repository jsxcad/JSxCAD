import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { seq } from './seq.js';

export const Wave = Shape.registerMethod2(
  'Wave',
  ['input', 'function', 'options'],
  async (input, particle = Point, options) => {
    let particles = [];
    for (const xDistance of await seq(
      options,
      (distance) => (_shape) => distance,
      (...numbers) => numbers
    )(input)) {
      particles.push(particle(xDistance).x(xDistance));
    }
    return Link(...particles)(input);
  }
);

export default Wave;
