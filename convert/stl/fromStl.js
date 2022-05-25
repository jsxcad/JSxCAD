import { fromPolygonsToGraph } from '@jsxcad/geometry';
import parseStlAscii from 'parse-stl-ascii';
import { parse as parseStlBinary } from './parseStlBinary.js';

const toParser = (format) => {
  switch (format) {
    case 'ascii':
      return (data) => parseStlAscii(new TextDecoder('utf8').decode(data));
    case 'binary':
      return parseStlBinary;
    default:
      throw Error('die');
  }
};

export const fromStl = async (
  stl,
  { format = 'ascii', geometry = 'graph' } = {}
) => {
  const parse = toParser(format);
  const { positions, cells } = parse(stl);
  const polygons = [];
  for (const [a, b, c] of cells) {
    const pa = positions[a];
    const pb = positions[b];
    const pc = positions[c];
    if (pa.some((value) => !isFinite(value))) continue;
    if (pb.some((value) => !isFinite(value))) continue;
    if (pc.some((value) => !isFinite(value))) continue;
    polygons.push({ points: [[...pa], [...pb], [...pc]] });
  }
  switch (geometry) {
    case 'graph':
      return fromPolygonsToGraph({}, polygons);
    default:
      throw Error(`Unknown geometry type ${geometry}`);
  }
};
