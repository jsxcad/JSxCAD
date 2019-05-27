import { Shape } from './Shape';
import { toSvg } from '@jsxcad/convert-svg';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write SVG
 *
 * ::: illustration
 * ```
 * cube().crossSection().writeSvg({ path: 'svg/cube1.svg' });
 * readSvg({ path: 'svg/cube1.svg' })
 * ```
 * :::
 * ::: illustration
 * ```
 * writeSvg({ path: 'svg/cube2.svg' }, cube().crossSection());
 * readSvg({ path: 'svg/cube2.svg' })
 * ```
 * :::
 *
 **/

export const writeSvg = async (options, shape) => {
  const { path } = options;
  const geometry = shape.toDisjointGeometry();
  return writeFile({ geometry, preview: true }, path, toSvg(options, geometry));
};

const method = function (options = {}) { writeSvg(options, this); return this; };

Shape.prototype.writeSvg = method;
