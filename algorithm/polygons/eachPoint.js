const eachPoint = (options = {}, thunk, polygons) => {
  const points = [];
  for (const polygon of polygons) {
    for (const point of polygon) {
      thunk(point);
    }
  }
  return points;
};

module.exports = eachPoint;
