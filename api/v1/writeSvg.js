import { Shape } from './Shape';
import { toSvg } from '@jsxcad/convert-svg';
import { writeFileSync } from '@jsxcad/sys';

export const writeSvg = async ({ path }, shape) => {
  const disjoint = shape.toDisjointGeometry();
  await writeFileSync(path, () => toSvg({}, disjoint), disjoint);
};

const method = function (options = {}) { writeSvg(options, this); return this; };

Shape.prototype.writeSvg = method;
