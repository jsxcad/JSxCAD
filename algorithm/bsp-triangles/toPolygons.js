export const toPolygons = (options = {}, bsp) => {
  // PROVE: That we need this slice.
  var polygons = bsp.polygons.slice();
  if (bsp.front !== undefined) {
    polygons = polygons.concat(toPolygons(options, bsp.front));
  }
  if (bsp.back !== undefined) {
    polygons = polygons.concat(toPolygons(options, bsp.back));
  }
  return polygons;
};
