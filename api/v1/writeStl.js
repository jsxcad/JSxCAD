import { Assembly } from './Assembly';
import { CSG } from './CSG';
import { polygonsToStla } from '@jsxcad/convert-stl';
import { writeFileSync } from '@jsxcad/sys';
import { makeSurfacesConvex, toPolygons } from '@jsxcad/algorithm-solid';

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

Assembly.prototype.writeStl = method;
CSG.prototype.writeStl = method;
