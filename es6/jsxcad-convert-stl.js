import { fromPolygons, makeWatertight } from './jsxcad-geometry-solid.js';
import { canonicalize, toTriangles } from './jsxcad-geometry-polygons.js';
import { toKeptGeometry, getSolids } from './jsxcad-geometry-tagged.js';
import { toPlane } from './jsxcad-math-poly3.js';
import { union } from './jsxcad-geometry-solid-boolean.js';

function parse(str) {
  if(typeof str !== 'string') {
    str = str.toString();
  }

  var positions = [];
  var cells = [];
  var faceNormals = [];
  var name = null;

  var lines = str.split('\n');
  var cell = [];

  for(var i=0; i<lines.length; i++) {

    var parts = lines[i]
      .trim()
      .split(' ')
      .filter(function(part) {
        return part !== '';
      });

    switch(parts[0]) {
      case 'solid':
        name = parts.slice(1).join(' ');
        break;
      case 'facet':
        var normal = parts.slice(2).map(Number);
        faceNormals.push(normal);
        break;
      case 'vertex':
        var position = parts.slice(1).map(Number);
        cell.push(positions.length);
        positions.push(position);
        break;
      case 'endfacet':
        cells.push(cell);
        cell = [];
        // skip
    }
  }

  return {
    positions: positions,
    cells: cells,
    faceNormals: faceNormals,
    name: name
  };
}

var parseStlAscii = parse;

// Adapted for ArrayBuffer from parse-stl-binary version ^1.0.1.

const LITTLE_ENDIAN = true;

const readVector = (view, off) => [view.getFloat32(off + 0, LITTLE_ENDIAN),
                                   view.getFloat32(off + 4, LITTLE_ENDIAN),
                                   view.getFloat32(off + 8, LITTLE_ENDIAN)];

const parse$1 = (data) => {
  const view = new DataView(data.buffer);
  var off = 80; // skip header

  var triangleCount = view.getUint32(off, LITTLE_ENDIAN);
  off += 4;

  var cells = [];
  var positions = [];
  var faceNormals = [];

  for (var i = 0; i < triangleCount; i++) {
    var cell = [];
    var normal = readVector(view, off);
    off += 12; // 3 floats

    faceNormals.push(normal);

    for (var j = 0; j < 3; j++) {
      var position = readVector(view, off);
      off += 12;
      cell.push(positions.length);
      positions.push(position);
    }

    cells.push(cell);
    off += 2; // skip attribute byte count
  }

  return {
    positions: positions,
    cells: cells,
    faceNormals: faceNormals
  };
};

const toParser = (format) => {
  switch (format) {
    case 'ascii': return parseStlAscii;
    case 'binary': return parse$1;
    default: throw Error('die');
  }
};

const fromStl = async (stl, { format = 'ascii' } = {}) => {
  const parse = toParser(format);
  const { positions, cells } = parse(stl);
  const polygons = [];
  for (const [a, b, c] of cells) {
    polygons.push([positions[a], positions[b], positions[c]]);
  }
  return { solid: fromPolygons({}, polygons) };
};

/**
 * Translates a polygon array [[[x, y, z], [x, y, z], ...]] to ascii STL.
 * The exterior side of a polygon is determined by a CCW point ordering.
 *
 * @param {Object} options.
 * @param {Polygon Array} polygons - An array of arrays of points.
 * @returns {String} - the ascii STL output.
 */

const fromSolidToTriangles = (solid) => {
  const triangles = [];
  for (const surface of makeWatertight(solid)) {
    for (const triangle of toTriangles({}, surface)) {
      triangles.push(triangle);
    }
  }
  return triangles;
};

const toStl = async (geometry, options = {}) => {
  const keptGeometry = toKeptGeometry(geometry);
  let solids = getSolids(keptGeometry).map(({ solid }) => solid);
  const triangles = fromSolidToTriangles(union(...solids));
  const output = `solid JSxCAD\n${convertToFacets(options, canonicalize(triangles))}\nendsolid JSxCAD\n`;
  return new TextEncoder('utf8').encode(output);
};

const convertToFacets = (options, polygons) =>
  polygons.map(convertToFacet).filter(facet => facet !== undefined).join('\n');

const toStlVector = vector =>
  `${vector[0]} ${vector[1]} ${vector[2]}`;

const toStlVertex = vertex =>
  `vertex ${toStlVector(vertex)}`;

const convertToFacet = (polygon) => {
  const plane = toPlane(polygon);
  if (plane !== undefined) {
    return `facet normal ${toStlVector(toPlane(polygon))}\n` +
           `outer loop\n` +
           `${toStlVertex(polygon[0])}\n` +
           `${toStlVertex(polygon[1])}\n` +
           `${toStlVertex(polygon[2])}\n` +
           `endloop\n` +
           `endfacet`;
  }
};

export { fromStl, toStl };
