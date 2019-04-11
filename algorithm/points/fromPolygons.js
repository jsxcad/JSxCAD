export const fromPolygons = (options = {}, polygons) => {
  const points = [];
  for (const polygon of polygons) {
    for (const point of polygon) {
      points.push(point);
    }
  }
  return points;
};
