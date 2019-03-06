const findPolygonsViolations = require('./findPolygonsViolations');

const isWatertightPolygons = polygons => findPolygonsViolations(polygons).length === 0;

module.exports = isWatertightPolygons;
