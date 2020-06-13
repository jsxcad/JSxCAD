const sin = (a) => Math.sin((a / 360) * Math.PI * 2);

export const regularPolygonEdgeLengthToRadius = (length, edges) =>
  length / (2 * sin(180 / edges));
