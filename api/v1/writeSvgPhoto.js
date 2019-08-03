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
 * Note: Illustrations broken due to scaling issue affecting readSvg.
 *
 * ::: illustration { "view": { "position": [0, -1, 2500] } }
 * ```
 * await Cube().writeSvgPhoto({ path: 'svg/cube3.svg', view: { position: [10, 10, 10], target: [0, 0, 0] } });
 * await readSvg({ path: 'svg/cube3.svg' })
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
  await writeFile({ geometry, preview: true }, path, toSvg(options, geometry));
};

const method = function (options = {}) { return writeSvgPhoto(options, this); };

Shape.prototype.writeSvgPhoto = method;
