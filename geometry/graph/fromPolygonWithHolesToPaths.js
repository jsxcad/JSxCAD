export const fromPolygonWithHolesToPaths = (polygon) => {
  const paths = [];
  paths.push(polygon.points);
  for (const hole of polygon.holes) {
    paths.push(hole.points);
  }
  return paths;
};
