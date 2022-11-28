import { Shape, destructure, ensurePages } from './jsxcad-api-shape.js';
import { fromStl, toStl } from './jsxcad-convert-stl.js';
import { read, getSourceLocation, generateUniqueId, write, emit } from './jsxcad-sys.js';
import { hash } from './jsxcad-geometry.js';

const Stl = Shape.registerShapeMethod(
  'Stl',
  async (path, { src, format = 'ascii', geometry = 'graph' } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    return Shape.fromGeometry(await fromStl(data, { format, geometry }));
  }
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

const prepareStl = async (shape, name, op = (s) => s, options = {}) => {
  const { path } = getSourceLocation();
  let index = 0;
  const records = [];
  for (const entry of await ensurePages(await op(Shape.chain(shape)))) {
    const stlPath = `download/stl/${path}/${generateUniqueId()}`;
    await write(stlPath, await toStl(entry, options));
    const filename = `${name}_${index++}.stl`;
    const record = {
      path: stlPath,
      filename: `${name}_${index++}.stl`,
      type: 'application/sla',
    };
    records.push(record);
    // Produce a view of what will be downloaded.
    const hash$1 =
      hashSum({ filename, options }) + hash(shape.toGeometry());
    Shape.fromGeometry(entry).view(name, options.view);
    emit({ download: { entries: [record] }, hash: hash$1 });
  }
  return records;
};

const stl = Shape.registerMethod('stl', (...args) => async (shape) => {
  const { value: name, func: op, object: options } = destructure(args);
  await prepareStl(shape, name, op, options);
  return shape;
});

const api = {
  Stl,
  stl,
};

export { Stl, api as default, stl };
