// Relax the coplanar arrangement into polygon soup.
export const toPolygons = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  return polygons;
};
