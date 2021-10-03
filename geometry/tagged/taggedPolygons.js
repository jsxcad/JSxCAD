export const taggedPolygons = ({ tags = [], matrix }, polygons) => {
  return { type: 'polygons', tags, matrix, polygons };
};
