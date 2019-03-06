const fixTJunctions = require('./fixTJunctions');

const makeWatertight = polygons => {
  return fixTJunctions(polygons);
};

module.exports = makeWatertight;
