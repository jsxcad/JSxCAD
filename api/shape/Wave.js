import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { seq } from './seq.js';

export const Wave = (...args) => {
  const { func: particle = Point, object: options } = Shape.destructure(args);
  let particles = [];
  for (const xDistance of seq(
    options,
    (distance) => distance,
    (...numbers) => numbers
  )()) {
    particles.push(particle(xDistance).x(xDistance));
  }
  return Link(particles);
};

export default Wave;

Shape.prototype.Wave = Shape.shapeMethod(Wave);
