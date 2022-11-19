import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { seq } from './seq.js';

export const Wave = Shape.registerShapeMethod('Wave', async (...args) => {
  const { func: particle = Point, object: options } = Shape.destructure(args);
  let particles = [];
  for (const xDistance of await seq(
    options,
    (distance) => (shape) => distance,
    (...numbers) => numbers
  )(null)) {
    particles.push(particle(xDistance).x(xDistance));
  }
  return Link(particles);
});

export default Wave;
