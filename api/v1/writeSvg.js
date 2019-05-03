import { Shape } from './Shape';
import { toSvg } from '@jsxcad/convert-svg';
import { writeFile } from '@jsxcad/sys';

export const writeSvg = async (options, shape) => {
  const { path } = options;
  const disjoint = shape.toDisjointGeometry();
  await writeFile(path, toSvg({}, disjoint), disjoint);
};

const method = function (options = {}) { writeSvg(options, this); return this; };

Shape.prototype.writeSvg = method;
