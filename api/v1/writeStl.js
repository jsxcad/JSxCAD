import { CSG } from './CSG';
import { canonicalize } from '@jsxcad/algorithm-polygons';
import { polygonsToStla } from '@jsxcad/algorithm-stl';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import { writeFileSync } from '@jsxcad/sys';

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
  writeFileSync(path, polygons, { translator: () => polygonsToStla({ needIsWatertight }, polygons) });
};

CSG.prototype.writeStl = function (options = {}) {
  writeStl(options, this);
  return this;
};
