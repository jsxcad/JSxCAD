import Link from './Link.js';
import Point from './Point.js';
import Seq from './seq.js';
import Shape from './Shape.js';

export const Spiral = Shape.registerMethod2(
  'Spiral',
  ['function', 'options'],
  async (particle = Point, options) => {
    let particles = [];
    for (const turn of await Seq(
      options,
      (distance) => (shape) => distance,
      (...numbers) => numbers
    )) {
      particles.push(await particle(turn).rz(turn));
    }
    const result = await Link(...particles);
    return result;
  }
);

export default Spiral;
