import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { seq } from './seq.js';

export const Wave = Shape.registerMethod('Wave', (...args) => async (shape) => {
  const [particle = Point, options] = await destructure2(
    shape,
    args,
    'function',
    'options'
  );
  let particles = [];
  for (const xDistance of await seq(
    options,
    (distance) => (shape) => distance,
    (...numbers) => numbers
  )(shape)) {
    particles.push(particle(xDistance).x(xDistance));
  }
  return Link(particles)(shape);
});

export default Wave;
