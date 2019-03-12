import { CSG } from './CSG';
import { canonicalize } from '@jsxcad/algorithm-polygons';
import { polygonsToStla } from '@jsxcad/algorithm-stl';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';

export const writeStl = ({ path }, shape) => {
  let polygons;
  if (shape instanceof Array) {
    polygons = shape;
  } else {
    polygons = shape.toPolygons({});
  }
  if (!isWatertightPolygons(polygons)) {
    polygons = canonicalize(polygons);
    if (!isWatertightPolygons(polygons)) {
      throw Error('Not watertight');
    }
  }
  // TODO: Need to abstract filesystem access so that it can work in a browser.
  require('fs').writeFileSync(path, polygonsToStla({}, polygons));
};

CSG.prototype.writeStl = function (options = {}) {
  writeStl(options, this);
  return this;
};
