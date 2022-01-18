export const taggedPolygons = ({ tags = [], matrix, provenance }, polygons) => {
  return { type: 'polygons', tags, matrix, provenance, polygons };
};
