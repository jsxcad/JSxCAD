import { Assembly } from './Assembly';
import { CSG } from './CSG';
import { polygonsToStla } from '@jsxcad/algorithm-stl';
import { writeFileSync } from '@jsxcad/sys';

export const writeStl = ({ path, needIsWatertight = true }, ...shapes) => {
  const solids = shapes.map(shape => {
    if (shape instanceof Array) {
      return shape;
    } else {
      return shape.toSolid({});
    }
  });
  writeFileSync(path, solids, { translator: () => polygonsToStla({ needIsWatertight }, [].concat(...solids)) });
};

const method = function (options = {}) { writeStl(options, this); return this; };

Assembly.prototype.writeStl = method;
CSG.prototype.writeStl = method;
