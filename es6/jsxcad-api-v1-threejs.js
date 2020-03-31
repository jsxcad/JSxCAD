import Shape from './jsxcad-api-v1-shape.js';
import { toSvg, toThreejsPage } from './jsxcad-convert-threejs.js';
import { writeFile } from './jsxcad-sys.js';

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

const writeSvgPhoto = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({ doSerialize: false }, `output/${path}`, toSvg(options, geometry));
  await writeFile({}, `geometry/${path}`, geometry);
};

const method = function (options = {}) { return writeSvgPhoto(options, this); };

Shape.prototype.writeSvgPhoto = method;

const writeThreejsPage = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({ doSerialize: false }, `output/${path}`, toThreejsPage(options, geometry));
  await writeFile({}, `geometry/${path}`, geometry);
};

const method$1 = function (options = {}) { return writeThreejsPage(options, this); };

Shape.prototype.writeThreejsPage = method$1;

const api = {
  writeSvgPhoto,
  writeThreejsPage
};

export default api;
export { writeSvgPhoto, writeThreejsPage };
