import { Shape } from './Shape';
import { toSvg } from '@jsxcad/convert-svg';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write SVG
 *
 * ::: illustration
 * ```
 * await cube().section().writeSvg('svg/cube1.svg');
 * await readSvg({ path: 'svg/cube1.svg' })
 * ```
 * :::
 * ::: illustration
 * ```
 * await writeSvg({ path: 'svg/cube2.svg' }, cube().section());
 * await readSvg({ path: 'svg/cube2.svg' })
 * ```
 * :::
 *
 **/

export const writeSvg = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  writeFile({ geometry, preview: true }, path, toSvg(options, geometry));
};

const method = function (options = {}) { return writeSvg(options, this); };

Shape.prototype.writeSvg = method;
