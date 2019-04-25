import { makeSurfacesConvex, toPolygons } from '@jsxcad/algorithm-solid';

import { Solid } from './Solid';
import { polygonsToStla } from '@jsxcad/convert-stl';
import { writeFileSync } from '@jsxcad/sys';

export const writeStl = async ({ path, needIsWatertight = true }, ...shapes) => {
  const solids = shapes.map(shape => {
    if (shape instanceof Array) {
      return shape;
    } else {
      const solid = shape.toSolid({});
      return solid;
    }
  });
  await writeFileSync(path,
                      () => polygonsToStla({ needIsWatertight }, [].concat(...solids.map(solid => toPolygons({}, makeSurfacesConvex({}, solid))))),
                      { solids });
};

const method = function (options = {}) { writeStl(options, this); return this; };

Solid.prototype.writeStl = method;
