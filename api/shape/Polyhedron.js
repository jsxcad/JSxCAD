import Shape from './Shape.js';

/*
export const ofPointPaths = (points = [], paths = []) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push({ points: path.map((point) => points[point]) });
  }
  return Shape.fromPolygons(polygons);
};
*/

export const ofPolygons = (...polygons) => {
  const out = [];
  for (const polygon of polygons) {
    if (polygon instanceof Array) {
      out.push({ points: polygon });
    } else if (polygon instanceof Shape) {
      out.push({ points: polygon.toPoints().reverse() });
    }
  }
  return Shape.fromPolygons(out);
};

export const Polyhedron = Shape.registerShapeMethod('Polyhedron', (...args) =>
  ofPolygons(...args)
);

export default Polyhedron;
