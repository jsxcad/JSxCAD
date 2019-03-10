import { CSG } from './CSG';
import { polygonsToStla } from '@jsxcad/algorithm-stl';

export const writeStl = ({ path }, shape) => {
  let polygons;
  if (shape instanceof Array) {
    polygons = shape;
  } else {
    polygons = shape.toPolygons({});
  }
  // TODO: Need to abstract filesystem access so that it can work in a browser.
  require('fs').writeFileSync(path, polygonsToStla({}, polygons));
};

CSG.prototype.writeStl = function (options = {}) {
  writeStl(options, this);
  return this;
}
