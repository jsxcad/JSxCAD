import Shape from './Shape.js';

export const Polyhedron = Shape.registerMethod(
  'Polyhedron',
  (...polygons) =>
    async (shape) => {
      const out = [];
      for (const polygon of polygons) {
        if (polygon instanceof Array) {
          out.push({ points: polygon });
        } else if (polygon instanceof Shape) {
          out.push({ points: polygon.toCoordinates().reverse() });
        }
      }
      return Shape.fromPolygons(out);
    }
);

export default Polyhedron;
