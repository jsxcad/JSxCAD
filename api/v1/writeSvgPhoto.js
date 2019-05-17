import { Shape } from './Shape';
import { toSvg } from '@jsxcad/convert-threejs';
import { writeFile } from '@jsxcad/sys';

export const writeSvgPhoto = async (options, shape) => {
  const { path } = options;
  const geometry = shape.toDisjointGeometry();
  return writeFile({ geometry, preview: true }, path, toSvg(options, geometry));
};

const method = function (options = {}) { writeSvgPhoto(options, this); return this; };

Shape.prototype.writeSvgPhoto = method;
