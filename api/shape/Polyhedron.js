import Shape from './Shape.js';

export const Polyhedron = Shape.registerMethod2(
  'Polyhedron',
  ['coordinateLists'],
  (coordinateLists) => {
    const out = [];
    for (const coordinates of coordinateLists) {
      out.push({ points: coordinates });
    }
    return Shape.fromPolygons(out);
  }
);

export default Polyhedron;
