import Shape$1, { Shape } from './jsxcad-api-v1-shape.js';
import { fromSvgPath, fromSvg, toSvg } from './jsxcad-convert-svg.js';
import { readFile, getSources, writeFile } from './jsxcad-sys.js';

/**
 *
 * # Svg Path
 *
 * Generates a path from svg path data.
 *
 * ::: illustration
 * ```
 * SvgPath({},
 *         'M 120.25163,89.678938 C 105.26945,76.865343 86.290871,70.978848 64.320641,70.277872 z')
 *   .center()
 *   .scale(0.2)
 * ```
 * :::
 *
 **/

const SvgPath = (options = {}, svgPath) =>
  Shape.fromGeometry(fromSvgPath(options, svgPath));

/**
 *
 * # Read Scalable Vector Format
 *
 * ::: illustration { "view": { "position": [0, 0, 100] } }
 * ```
 *
 * const svg = await readSvg({ path: 'svg/butterfly.svg',
 *                             sources: [{ file: 'svg/butterfly.svg' },
 *                                       { url: 'https://jsxcad.js.org/svg/butterfly.svg' }] });
 * svg.center().scale(0.02)
 * ```
 * :::
 *
 **/

const readSvg = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ decode: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ decode: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape$1.fromGeometry(await fromSvg(options, data));
};

/**
 *
 * # Read SVG path data
 *
 **/

const readSvgPath = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ decode: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ decode: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape$1.fromGeometry(await fromSvgPath(options, data));
};

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

const writeSvg = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `output/${path}`, toSvg(options, geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (options = {}) { return writeSvg(options, this); };
Shape$1.prototype.writeSvg = method;

const api = { SvgPath, readSvg, readSvgPath, writeSvg };

export default api;
export { SvgPath, readSvg, readSvgPath, writeSvg };
