import { CSG } from './CSG';
import { canonicalize } from '@jsxcad/algorithm-polygons';
import { polygonsToStla } from '@jsxcad/algorithm-stl';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';

export const writeStl = ({ path, needIsWatertight = true }, shape) => {
  let polygons;
  if (shape instanceof Array) {
    polygons = shape;
  } else {
    polygons = shape.toPolygons({});
  }
  if (!isWatertightPolygons(polygons)) {
    polygons = canonicalize(polygons);
    if (!isWatertightPolygons(polygons)) {
      // if (needIsWatertight) throw Error('Not watertight');
      console.log('Warning: not watertight.');
    }
  }
  // TODO: Need to abstract filesystem access so that it can work in a browser.
  require('fs').writeFileSync(path, polygonsToStla({ needIsWatertight: needIsWatertight }, polygons));
};

CSG.prototype.writeStl = function (options = {}) {
  writeStl(options, this);
  return this;
};
