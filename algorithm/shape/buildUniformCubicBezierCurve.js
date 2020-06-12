import bezier from "bezier";

const interpolateCubicBezier = bezier.prepare(4);

// Approximate a cubic bezier by dividing the curve into a uniform number of segments.

export const buildUniformCubicBezierCurve = ({ segments = 8 }, points) => {
  const xPoints = points.map((point) => point[0]);
  const yPoints = points.map((point) => point[1]);
  const path = [];
  for (let t = 0; t <= 1; t += 1 / segments) {
    path.push([
      interpolateCubicBezier(xPoints, t),
      interpolateCubicBezier(yPoints, t),
    ]);
  }
  return path;
};
