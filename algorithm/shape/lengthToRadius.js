const sin = (a) => Math.sin(a / 360 * Math.PI * 2);

const regularPolygonEdgeLengthToRadius = (length, edges) => length / (2 * sin(180 / edges));

module.exports = regularPolygonEdgeLengthToRadius;
