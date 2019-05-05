import { Shape } from './Shape';
import { assemble } from './assemble';
import { toStl } from '@jsxcad/convert-stl';
import { writeFile } from '@jsxcad/sys';

export const writeStl = async (options, ...shapes) => {
  const { path } = options;
  const geometry = assemble(...shapes).toDisjointGeometry();
  return writeFile(path, toStl(options, geometry), geometry);
};

const method = function (options = {}) { writeStl(options, this); return this; };

Shape.prototype.writeStl = method;
