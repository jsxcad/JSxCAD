import Shape$1, { Shape } from './jsxcad-api-v1-shape.js';
import { fromSvgPath, fromSvg, toSvg as toSvg$1 } from './jsxcad-convert-svg.js';
import { readFile, getSources, writeFile } from './jsxcad-sys.js';
import { toKeptGeometry, getPlans, getLeafs } from './jsxcad-geometry-tagged.js';

/**
 *
 * # Svg Path
 *
 * Generates a path from svg path data.
 *
 * ::: illustration
 * ```
 * SvgPath('M 120.25163,89.678938 C 105.26945,76.865343 86.290871,70.978848 64.320641,70.277872 z')
 *   .center()
 *   .scale(0.2)
 * ```
 * :::
 *
 **/

const SvgPath = (svgPath, options = {}) =>
  Shape.fromGeometry(fromSvgPath(new TextEncoder('utf8').encode(svgPath), options));

const readSvg = async (path, { src } = {}) => {
  let data = await readFile({ doSerialize: false }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ decode: 'utf8', sources: [src] }, `cache/${path}`);
  }
  if (data === undefined) {
    data = await readFile({ doSerialize: false, decode: 'utf8' }, `output/${path}`);
  }
  if (data === undefined) {
    throw Error(`Cannot find ${path}`);
  }
  return Shape$1.fromGeometry(await fromSvg(data));
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

const toSvg = async (shape, options = {}) => {
  const pages = [];
  // CHECK: Should this be limited to Page plans?
  const geometry = shape.toKeptGeometry();
  for (const entry of getPlans(geometry)) {
    if (entry.plan.page) {
      for (let leaf of getLeafs(entry.content)) {
        const svg = await toSvg$1(leaf);
        pages.push({ svg, leaf: { ...entry, content: leaf }, index: pages.length });
      }
    }
  }
  return pages;
};

const writeSvg = async (shape, name, options = {}) => {
  for (const { svg, leaf, index } of await toSvg(shape, options)) {
    await writeFile({ doSerialize: false }, `output/${name}_${index}.svg`, svg);
    await writeFile({}, `geometry/${name}_${index}.svg`, toKeptGeometry(leaf));
  }
};

const method = function (...args) { return writeSvg(this, ...args); };
Shape$1.prototype.writeSvg = method;

const api = { SvgPath, readSvg, readSvgPath, writeSvg };

export default api;
export { SvgPath, readSvg, readSvgPath, writeSvg };
