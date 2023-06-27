import Link from './Link.js';
import Point from './Point.js';
import Seq from './seq.js';
import Shape from './Shape.js';

export const Spiral = Shape.registerMethod2(
  'Spiral',
  ['function', 'options'],
  async (particle = Point, options) => {
    let particles = [];
    const turns = await Seq(
      options,
      (distance) => (_shape) => distance,
      (...numbers) => numbers
    );
    for (const turn of turns) {
      particles.push(await particle(turn).rz(turn));
    }
    const result = await Link(...particles);
    return result;
  }
);

export default Spiral;
