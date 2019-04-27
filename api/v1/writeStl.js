import { makeSurfacesConvex, toPolygons } from '@jsxcad/algorithm-solid';

import { Solid } from './Solid';
import { assemble } from './assemble';
import { toStla } from '@jsxcad/convert-stl';
import { writeFileSync } from '@jsxcad/sys';

export const writeStl = async ({ path, needIsWatertight = true }, ...shapes) => {
  const geometry = assemble(...shapes).toDisjointGeometry();
  await writeFileSync(path, () => toStla({ needIsWatertight }, geometry), geometry);
};

const method = function (options = {}) { writeStl(options, this); return this; };

Solid.prototype.writeStl = method;
