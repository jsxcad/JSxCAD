import { Shape } from './Shape';
import { toSvg } from '@jsxcad/convert-threejs';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write SVG Photo
 *
 * This takes a scene and a camera position and generates a two-dimensional SVG representation
 * as a svg tag.
 *
 * ::: illustration { "view": { "position": [0, -1, 2500] } }
 * ```
 * cube().writeSvgPhoto({ path: 'svg/cube3.svg', view: { position: [10, 10, 10], target: [0, 0, 0] } });
 * readSvg({ path: 'svg/cube3.svg' })
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 2500] } }
 * ```
 * writeSvgPhoto({ path: 'svg/cube4.svg', view: { position: [10, 10, 10], target: [0, 0, 0] } }, cube());
 * readSvg({ path: 'svg/cube4.svg' })
 * ```
 * :::
 *
 **/

export const writeSvgPhoto = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  return writeFile({ geometry, preview: true }, path, toSvg(options, geometry));
};

const method = function (options = {}) { return writeSvgPhoto(options, this); };

Shape.prototype.writeSvgPhoto = method;
