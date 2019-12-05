function array_cancel() {
  this._array = null;
  return Promise.resolve();
}

function array_read() {
  var array = this._array;
  this._array = null;
  return Promise.resolve(array ? {done: false, value: array} : {done: true, value: undefined});
}

function array(array) {
  return new ArraySource(array instanceof Uint8Array ? array : new Uint8Array(array));
}

function ArraySource(array) {
  this._array = array;
}

ArraySource.prototype.read = array_read;
ArraySource.prototype.cancel = array_cancel;

function fetchPath(url) {
  return fetch(url).then(function(response) {
    return response.body && response.body.getReader
        ? response.body.getReader()
        : response.arrayBuffer().then(array);
  });
}

function requestPath(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest;
    request.responseType = "arraybuffer";
    request.onload = function() { resolve(array(request.response)); };
    request.onerror = reject;
    request.ontimeout = reject;
    request.open("GET", url, true);
    request.send();
  });
}

function path(path) {
  return (typeof fetch === "function" ? fetchPath : requestPath)(path);
}

function stream(source) {
  return typeof source.read === "function" ? source : source.getReader();
}

var empty = new Uint8Array(0);

function slice_cancel() {
  return this._source.cancel();
}

function concat(a, b) {
  if (!a.length) return b;
  if (!b.length) return a;
  var c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
}

function slice_read() {
  var that = this, array = that._array.subarray(that._index);
  return that._source.read().then(function(result) {
    that._array = empty;
    that._index = 0;
    return result.done ? (array.length > 0
        ? {done: false, value: array}
        : {done: true, value: undefined})
        : {done: false, value: concat(array, result.value)};
  });
}

function slice_slice(length) {
  if ((length |= 0) < 0) throw new Error("invalid length");
  var that = this, index = this._array.length - this._index;

  // If the request fits within the remaining buffer, resolve it immediately.
  if (this._index + length <= this._array.length) {
    return Promise.resolve(this._array.subarray(this._index, this._index += length));
  }

  // Otherwise, read chunks repeatedly until the request is fulfilled.
  var array = new Uint8Array(length);
  array.set(this._array.subarray(this._index));
  return (function read() {
    return that._source.read().then(function(result) {

      // When done, it’s possible the request wasn’t fully fullfilled!
      // If so, the pre-allocated array is too big and needs slicing.
      if (result.done) {
        that._array = empty;
        that._index = 0;
        return index > 0 ? array.subarray(0, index) : null;
      }

      // If this chunk fulfills the request, return the resulting array.
      if (index + result.value.length >= length) {
        that._array = result.value;
        that._index = length - index;
        array.set(result.value.subarray(0, length - index), index);
        return array;
      }

      // Otherwise copy this chunk into the array, then read the next chunk.
      array.set(result.value, index);
      index += result.value.length;
      return read();
    });
  })();
}

function slice(source) {
  return typeof source.slice === "function" ? source :
      new SliceSource(typeof source.read === "function" ? source
          : source.getReader());
}

function SliceSource(source) {
  this._source = source;
  this._array = empty;
  this._index = 0;
}

SliceSource.prototype.read = slice_read;
SliceSource.prototype.slice = slice_slice;
SliceSource.prototype.cancel = slice_cancel;

function dbf_cancel() {
  return this._source.cancel();
}

function readBoolean(value) {
  return /^[nf]$/i.test(value) ? false
      : /^[yt]$/i.test(value) ? true
      : null;
}

function readDate(value) {
  return new Date(+value.substring(0, 4), value.substring(4, 6) - 1, +value.substring(6, 8));
}

function readNumber(value) {
  return !(value = value.trim()) || isNaN(value = +value) ? null : value;
}

function readString(value) {
  return value.trim() || null;
}

var types = {
  B: readNumber,
  C: readString,
  D: readDate,
  F: readNumber,
  L: readBoolean,
  M: readNumber,
  N: readNumber
};

function dbf_read() {
  var that = this, i = 1;
  return that._source.slice(that._recordLength).then(function(value) {
    return value && (value[0] !== 0x1a) ? {done: false, value: that._fields.reduce(function(p, f) {
      p[f.name] = types[f.type](that._decode(value.subarray(i, i += f.length)));
      return p;
    }, {})} : {done: true, value: undefined};
  });
}

function view(array) {
  return new DataView(array.buffer, array.byteOffset, array.byteLength);
}

function dbf(source, decoder) {
  source = slice(source);
  return source.slice(32).then(function(array) {
    var head = view(array);
    return source.slice(head.getUint16(8, true) - 32).then(function(array) {
      return new Dbf(source, decoder, head, view(array));
    });
  });
}

function Dbf(source, decoder, head, body) {
  this._source = source;
  this._decode = decoder.decode.bind(decoder);
  this._recordLength = head.getUint16(10, true);
  this._fields = [];
  for (var n = 0; body.getUint8(n) !== 0x0d; n += 32) {
    for (var j = 0; j < 11; ++j) if (body.getUint8(n + j) === 0) break;
    this._fields.push({
      name: this._decode(new Uint8Array(body.buffer, body.byteOffset + n, j)),
      type: String.fromCharCode(body.getUint8(n + 11)),
      length: body.getUint8(n + 16)
    });
  }
}

var prototype = Dbf.prototype;
prototype.read = dbf_read;
prototype.cancel = dbf_cancel;

function cancel() {
  return this._source.cancel();
}

function parseMultiPoint(record) {
  var i = 40, j, n = record.getInt32(36, true), coordinates = new Array(n);
  for (j = 0; j < n; ++j, i += 16) coordinates[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];
  return {type: "MultiPoint", coordinates: coordinates};
}

function parseNull() {
  return null;
}

function parsePoint(record) {
  return {type: "Point", coordinates: [record.getFloat64(4, true), record.getFloat64(12, true)]};
}

function parsePolygon(record) {
  var i = 44, j, n = record.getInt32(36, true), m = record.getInt32(40, true), parts = new Array(n), points = new Array(m), polygons = [], holes = [];
  for (j = 0; j < n; ++j, i += 4) parts[j] = record.getInt32(i, true);
  for (j = 0; j < m; ++j, i += 16) points[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];

  parts.forEach(function(i, j) {
    var ring = points.slice(i, parts[j + 1]);
    if (ringClockwise(ring)) polygons.push([ring]);
    else holes.push(ring);
  });

  holes.forEach(function(hole) {
    polygons.some(function(polygon) {
      if (ringContainsSome(polygon[0], hole)) {
        polygon.push(hole);
        return true;
      }
    }) || polygons.push([hole]);
  });

  return polygons.length === 1
      ? {type: "Polygon", coordinates: polygons[0]}
      : {type: "MultiPolygon", coordinates: polygons};
}
function ringClockwise(ring) {
  if ((n = ring.length) < 4) return false;
  var i = 0, n, area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
  while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  return area >= 0;
}

function ringContainsSome(ring, hole) {
  var i = -1, n = hole.length, c;
  while (++i < n) {
    if (c = ringContains(ring, hole[i])) {
      return c > 0;
    }
  }
  return false;
}

function ringContains(ring, point) {
  var x = point[0], y = point[1], contains = -1;
  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i], xi = pi[0], yi = pi[1],
        pj = ring[j], xj = pj[0], yj = pj[1];
    if (segmentContains(pi, pj, point)) {
      return 0;
    }
    if (((yi > y) !== (yj > y)) && ((x < (xj - xi) * (y - yi) / (yj - yi) + xi))) {
      contains = -contains;
    }
  }
  return contains;
}

function segmentContains(p0, p1, p2) {
  var x20 = p2[0] - p0[0], y20 = p2[1] - p0[1];
  if (x20 === 0 && y20 === 0) return true;
  var x10 = p1[0] - p0[0], y10 = p1[1] - p0[1];
  if (x10 === 0 && y10 === 0) return false;
  var t = (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10);
  return t < 0 || t > 1 ? false : t === 0 || t === 1 ? true : t * x10 === x20 && t * y10 === y20;
}

function parsePolyLine(record) {
  var i = 44, j, n = record.getInt32(36, true), m = record.getInt32(40, true), parts = new Array(n), points = new Array(m);
  for (j = 0; j < n; ++j, i += 4) parts[j] = record.getInt32(i, true);
  for (j = 0; j < m; ++j, i += 16) points[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];
  return n === 1
      ? {type: "LineString", coordinates: points}
      : {type: "MultiLineString", coordinates: parts.map(function(i, j) { return points.slice(i, parts[j + 1]); })};
}

function concat$1(a, b) {
  var ab = new Uint8Array(a.length + b.length);
  ab.set(a, 0);
  ab.set(b, a.length);
  return ab;
}

function shp_read() {
  var that = this;
  ++that._index;
  return that._source.slice(12).then(function(array) {
    if (array == null) return {done: true, value: undefined};
    var header = view(array);

    // If the record starts with an invalid shape type (see #36), scan ahead in
    // four-byte increments to find the next valid record, identified by the
    // expected index, a non-empty content length and a valid shape type.
    function skip() {
      return that._source.slice(4).then(function(chunk) {
        if (chunk == null) return {done: true, value: undefined};
        header = view(array = concat$1(array.slice(4), chunk));
        return header.getInt32(0, false) !== that._index ? skip() : read();
      });
    }

    // All records should have at least four bytes (for the record shape type),
    // so an invalid content length indicates corruption.
    function read() {
      var length = header.getInt32(4, false) * 2 - 4, type = header.getInt32(8, true);
      return length < 0 || (type && type !== that._type) ? skip() : that._source.slice(length).then(function(chunk) {
        return {done: false, value: type ? that._parse(view(concat$1(array.slice(8), chunk))) : null};
      });
    }

    return read();
  });
}

var parsers = {
  0: parseNull,
  1: parsePoint,
  3: parsePolyLine,
  5: parsePolygon,
  8: parseMultiPoint,
  11: parsePoint, // PointZ
  13: parsePolyLine, // PolyLineZ
  15: parsePolygon, // PolygonZ
  18: parseMultiPoint, // MultiPointZ
  21: parsePoint, // PointM
  23: parsePolyLine, // PolyLineM
  25: parsePolygon, // PolygonM
  28: parseMultiPoint // MultiPointM
};

function shp(source) {
  source = slice(source);
  return source.slice(100).then(function(array) {
    return new Shp(source, view(array));
  });
}
function Shp(source, header) {
  var type = header.getInt32(32, true);
  if (!(type in parsers)) throw new Error("unsupported shape type: " + type);
  this._source = source;
  this._type = type;
  this._index = 0;
  this._parse = parsers[type];
  this.bbox = [header.getFloat64(36, true), header.getFloat64(44, true), header.getFloat64(52, true), header.getFloat64(60, true)];
}

var prototype$1 = Shp.prototype;
prototype$1.read = shp_read;
prototype$1.cancel = cancel;

function noop() {}

function shapefile_cancel() {
  return Promise.all([
    this._dbf && this._dbf.cancel(),
    this._shp.cancel()
  ]).then(noop);
}

function shapefile_read() {
  var that = this;
  return Promise.all([
    that._dbf ? that._dbf.read() : {value: {}},
    that._shp.read()
  ]).then(function(results) {
    var dbf = results[0], shp = results[1];
    return shp.done ? shp : {
      done: false,
      value: {
        type: "Feature",
        properties: dbf.value,
        geometry: shp.value
      }
    };
  });
}

function shapefile(shpSource, dbfSource, decoder) {
  return Promise.all([
    shp(shpSource),
    dbfSource && dbf(dbfSource, decoder)
  ]).then(function(sources) {
    return new Shapefile(sources[0], sources[1]);
  });
}

function Shapefile(shp, dbf) {
  this._shp = shp;
  this._dbf = dbf;
  this.bbox = shp.bbox;
}

var prototype$2 = Shapefile.prototype;
prototype$2.read = shapefile_read;
prototype$2.cancel = shapefile_cancel;

function open(shp, dbf, options) {
  if (typeof dbf === "string") {
    if (!/\.dbf$/.test(dbf)) dbf += ".dbf";
    dbf = path(dbf);
  } else if (dbf instanceof ArrayBuffer || dbf instanceof Uint8Array) {
    dbf = array(dbf);
  } else if (dbf != null) {
    dbf = stream(dbf);
  }
  if (typeof shp === "string") {
    if (!/\.shp$/.test(shp)) shp += ".shp";
    if (dbf === undefined) dbf = path(shp.substring(0, shp.length - 4) + ".dbf").catch(function() {});
    shp = path(shp);
  } else if (shp instanceof ArrayBuffer || shp instanceof Uint8Array) {
    shp = array(shp);
  } else {
    shp = stream(shp);
  }
  return Promise.all([shp, dbf]).then(function(sources) {
    var shp = sources[0], dbf = sources[1], encoding = "windows-1252";
    if (options && options.encoding != null) encoding = options.encoding;
    return shapefile(shp, dbf, dbf && new TextDecoder(encoding));
  });
}

function read(shp, dbf, options) {
  return open(shp, dbf, options).then(function(source) {
    var features = [], collection = {type: "FeatureCollection", features: features, bbox: source.bbox};
    return source.read().then(function read(result) {
      if (result.done) return collection;
      features.push(result.value);
      return source.read().then(read);
    });
  });
}

const toVec3 = ([x = 0, y = 0, z = 0]) => [x, y, z];

const toTags = (properties) => {
  const tags = [];
  if (properties !== undefined) {
    for (const key of Object.keys(properties)) {
      tags.push(`user/shapefile/${key}/${properties[key]}`);
    }
  }
  return tags;
};

const toGeometry = (geometry, properties) => {
  const tags = toTags(properties);
  switch (geometry.type) {
    case 'Point':
      return { points: [toVec3(geometry.coordinates)], tags };
    case 'LineString':
      return { paths: [[null, ...geometry.coordinates.map(toVec3)]], tags };
    case 'Polygon':
      return { z0Surface: geometry.coordinates.map(path => path.map(toVec3)), tags };
    case 'MultiPoint':
      return { points: geometry.coordinates.map(toVec3), tags };
    case 'MultiLineString':
      return { paths: geometry.coordinates.map(line => [null, ...line.map(toVec3)]), tags };
    case 'MultiPolygon':
      return { assembly: geometry.coordinates.map(surface => ({ z0Surface: surface.map(polygon => polygon.map(toVec3)), tags })) };
    case 'GeometryCollection':
      return { assembly: geometry.geometries.map(toGeometry), tags };
    case 'FeatureCollection':
      return { assembly: geometry.features.map(feature => toGeometry(feature.geometry, feature.properties)), tags };
    default:
      throw Error('die');
  }
};

const fromShapefile = async (options, shp, dbf) => {
  const geoJson = await read(shp, dbf);
  const geometry = toGeometry(geoJson);
  return geometry;
};

export { fromShapefile };
