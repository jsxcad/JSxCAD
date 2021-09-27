export const taggedPolygons = ({ tags = [] }, polygons) => {
  return { type: 'polygons', tags, polygons };
};
