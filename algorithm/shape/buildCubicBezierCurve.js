const interpolateCubicBezier = require('bezier').prepare(4);

// TODO: Change from segments to point-distance metric.

const buildCubicBezierCurve = ({ segments = 8 }, points) => {
  const xPoints = points.map(point => point[0]);
  const yPoints = points.map(point => point[1]);
  const path = [];
  for (let t = 0; t <= 1; t += 1 / segments) {
    path.push([interpolateCubicBezier(xPoints, t),
               interpolateCubicBezier(yPoints, t)]);
  }
  return path;
};

module.exports = buildCubicBezierCurve;
