const build = require('./build');
const create = require('./create');

const fromPolygons = (options = {}, polygons) => {
  const bsp = create();
  // Build is destructive.
  build(bsp, polygons.map(polygon => polygon.slice()));
  return bsp;
};

module.exports = fromPolygons;
