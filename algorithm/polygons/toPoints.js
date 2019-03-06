const eachPoint = require('./eachPoint');

const toPoints = (options, polygons) => {
  const points = [];
  eachPoint(options, point => points.push(point), polygons);
  return points;
};

module.exports = toPoints;
