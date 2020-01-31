import { fromPolygons } from '@jsxcad/geometry-solid';
import parseStlAscii from 'parse-stl-ascii';
import { parse as parseStlBinary } from './parseStlBinary';

const toParser = (format) => {
  switch (format) {
    case 'ascii': return parseStlAscii;
    case 'binary': return parseStlBinary;
    default: throw Error('die');
  }
};

export const fromStl = async (stl, { format = 'ascii' } = {}) => {
  const parse = toParser(format);
  const { positions, cells } = parse(stl);
  const polygons = [];
  for (const [a, b, c] of cells) {
    polygons.push([positions[a], positions[b], positions[c]]);
  }
  return { solid: fromPolygons({}, polygons) };
};
