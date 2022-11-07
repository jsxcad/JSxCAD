import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { seq } from './seq.js';

export const Spiral = Shape.registerShapeMethod('Spiral', (...args) => {
  const { func: particle = Point, object: options } = Shape.destructure(args);
  let particles = [];
  for (const turn of seq(
    options,
    (distance) => distance,
    (...numbers) => numbers
  )()) {
    particles.push(particle(turn).rz(turn));
  }
  return Link(particles);
});

export default Spiral;
