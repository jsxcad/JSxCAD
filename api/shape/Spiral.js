import Link from './Link.js';
import Point from './Point.js';
import Seq from './seq.js';
import Shape from './Shape.js';

export const Spiral = Shape.registerShapeMethod('Spiral', async (...args) => {
  const { func: particle = Point, object: options } = Shape.destructure(args);
  let particles = [];
  for (const turn of await Seq(
    options,
    (distance) => distance,
    (...numbers) => numbers
  )) {
    particles.push(await particle(turn).rz(turn));
  }
  const result = await Link(particles);
  return result;
});

export default Spiral;
