import { Shape, ensurePages, gridView } from './jsxcad-api-shape.js';
import { fromSvg, fromSvgPath, toSvg } from './jsxcad-convert-svg.js';
import { read, getSourceLocation, generateUniqueId, write, emit } from './jsxcad-sys.js';
import { hash } from './jsxcad-geometry.js';

const LoadSvg = Shape.registerShapeMethod(
  'LoadSvg',
  async (path, { fill = true, stroke = true } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    if (data === undefined) {
      throw Error(`Cannot read svg from ${path}`);
    }
    return Shape.fromGeometry(
      await fromSvg(data, { doFill: fill, doStroke: stroke })
    );
  }
);

const Svg = Shape.registerShapeMethod(
  'Svg',
  async (svg, { fill = true, stroke = true } = {}) => {
    const data = new TextEncoder('utf8').encode(svg);
    return Shape.fromGeometry(
      await fromSvg(data, { doFill: fill, doStroke: stroke })
    );
  }
);

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
  Shape.fromGeometry(
    fromSvgPath(new TextEncoder('utf8').encode(svgPath), options)
  );

function pad (hash, len) {
  while (hash.length < len) {
    hash = '0' + hash;
  }
  return hash;
}

function fold (hash, text) {
  var i;
  var chr;
  var len;
  if (text.length === 0) {
    return hash;
  }
  for (i = 0, len = text.length; i < len; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash < 0 ? hash * -2 : hash;
}

function foldObject (hash, o, seen) {
  return Object.keys(o).sort().reduce(foldKey, hash);
  function foldKey (hash, key) {
    return foldValue(hash, o[key], key, seen);
  }
}

function foldValue (input, value, key, seen) {
  var hash = fold(fold(fold(input, key), toString(value)), typeof value);
  if (value === null) {
    return fold(hash, 'null');
  }
  if (value === undefined) {
    return fold(hash, 'undefined');
  }
  if (typeof value === 'object' || typeof value === 'function') {
    if (seen.indexOf(value) !== -1) {
      return fold(hash, '[Circular]' + key);
    }
    seen.push(value);

    var objHash = foldObject(hash, value, seen);

    if (!('valueOf' in value) || typeof value.valueOf !== 'function') {
      return objHash;
    }

    try {
      return fold(objHash, String(value.valueOf()))
    } catch (err) {
      return fold(objHash, '[valueOf exception]' + (err.stack || err.message))
    }
  }
  return fold(hash, value.toString());
}

function toString (o) {
  return Object.prototype.toString.call(o);
}

function sum (o) {
  return pad(foldValue(0, o, '', []).toString(16), 8);
}

var hashSum = sum;

const prepareSvg = async (shape, name, op = (s) => s, options = {}) => {
  const { path } = getSourceLocation();
  let index = 0;
  const records = [];
  for (const entry of await ensurePages(op(shape))) {
    const svgPath = `download/svg/${path}/${generateUniqueId()}`;
    await write(svgPath, await toSvg(entry, options));
    const filename = `${name}_${index++}.svg`;
    const record = {
      path: svgPath,
      filename,
      type: 'image/svg+xml',
    };
    records.push(record);
    const hash$1 = hashSum({ filename, options }) + hash(entry);
    await gridView(hash$1, options.view)(Shape.fromGeometry(entry));
    emit({ download: { entries: [record] }, hash: hash$1 });
  }
  return records;
};

const svg = Shape.registerMethod(
  'svg',
  (name, op, options = {}) =>
    async (shape) => {
      await prepareSvg(shape, name, op, options);
      return shape;
    }
);

const api = { LoadSvg, SvgPath, Svg, svg };

export { LoadSvg, Svg, SvgPath, api as default, svg };
