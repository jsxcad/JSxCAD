import { Shape } from './Shape';
import { toSvg } from '@jsxcad/convert-svg';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write SVG
 *
 * ::: illustration
 * ```
 * await Cube().section().writeSvg('svg/cube1.svg');
 * await readSvg({ path: 'svg/cube1.svg' })
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
  await writeFile({}, `output/${path}`, toSvg(options, geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (options = {}) { return writeSvg(options, this); };

Shape.prototype.writeSvg = method;
