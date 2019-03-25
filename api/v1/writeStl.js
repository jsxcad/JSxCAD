import { CSG } from './CSG';
import { canonicalize } from '@jsxcad/algorithm-polygons';
import { polygonsToStla } from '@jsxcad/algorithm-stl';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import { writeFileSync } from '@jsxcad/sys';

export const writeStl = ({ path, needIsWatertight = true }, ...shapes) => {
  const pathSets = shapes.map(shape => {
                                if (shape instanceof Array) {
                                  return shape;
                                } else {
                                  return shape.toPolygons({});
                                }
                              });
  writeFileSync(path, pathSets, { translator: () => polygonsToStla({ needIsWatertight }, [].concat(...pathSets)) });
};

CSG.prototype.writeStl = function (options = {}) {
  writeStl(options, this);
  return this;
};
