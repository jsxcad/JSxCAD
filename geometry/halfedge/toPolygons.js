import getEdges from './getEdges';

export const toPolygons = (loops) => {
  const polygons = [];
  for (const loop of loops) {
    const polygon = [];
    for (const edge of getEdges(loop)) {
      if (polygon.length === 0 || polygon[polygon.length - 1] !== edge.start) {
        polygon.push(edge.start);
      }
    }
    if (polygon[polygon.length - 1] === polygon[0]) {
      polygon.pop();
    }
    if (polygon.length >= 3) {
      polygons.push(polygon);
    }
  }
  return polygons;
};

export default toPolygons;
