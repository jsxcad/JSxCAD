export const fromPolygonWithHolesToPaths = (polygon) => {
  const paths = [];
  if (polygon.points.length >= 3) {
    paths.push(polygon.points);
  }
  for (const hole of polygon.holes) {
    if (hole.points.length >= 3) {
      paths.push(hole.points);
    }
  }
  return paths;
};
