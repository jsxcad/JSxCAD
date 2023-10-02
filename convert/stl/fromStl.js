import { fromPolygonSoup } from '@jsxcad/geometry';
import parseStlAscii from 'parse-stl-ascii';
import { parse as parseStlBinary } from './parseStlBinary.js';

const parse = (data, format) => {
  switch (format) {
    case 'ascii':
      try {
        return parseStlAscii(new TextDecoder('utf8').decode(data));
      } catch (error) {
        if (error instanceof RangeError) {
          return parseStlBinary(data);
        } else {
          throw error;
        }
      }
    case 'binary':
      try {
        return parseStlBinary(data);
      } catch (error) {
        // Try falling back to ascii.
        if (error instanceof RangeError) {
          return parseStlAscii(new TextDecoder('utf8').decode(data));
        } else {
          throw error;
        }
      }
    default:
      throw Error('die');
  }
};

export const fromStl = async (
  stl,
  {
    format = 'ascii',
    wrapAlways,
    wrapAbsoluteAlpha,
    wrapAbsoluteOffset,
    wrapRelativeAlpha = 300,
    wrapRelativeOffset = 5000,
    faceCountLimit = 0,
    sharpEdgeThreshold = 0,
    doRemoveSelfIntersections = false,
    doWrap = false,
    doAutorefine = false,
  } = {}
) => {
  const { positions, cells } = parse(stl, format);
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
  return fromPolygonSoup(polygons, {
    tolerance: 0,
    wrapAlways,
    wrapRelativeAlpha,
    wrapRelativeOffset,
    wrapAbsoluteAlpha,
    wrapAbsoluteOffset,
    faceCountLimit,
    sharpEdgeThreshold,
    doRemoveSelfIntersections,
    doWrap,
    doAutorefine,
  });
};
