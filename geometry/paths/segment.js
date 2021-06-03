import { add, length, normalize, scale, subtract } from '@jsxcad/math-vec3';
import { getEdges } from '../geometry-path';

export const segment = (paths, start, end) => {
  const segments = [];
  let segment = [];
  let position = 0;
  let collecting = false;
  for (const path of paths) {
    for (const [first, second] of getEdges(path)) {
      const vector = subtract(second, first);
      const nextPosition = position + length(vector);
      if (collecting === false) {
        if (nextPosition >= start) {
          const point = add(first, scale(start - position, normalize(vector)));
          // The segments are always open paths.
          segment.push(null, point);
          if (start - position < 0) {
            throw Error('die');
          }
          collecting = true;
        }
      }
      if (collecting === true) {
        if (position > start && segment.length === 0) {
          segment.push(first);
        }
        if (nextPosition >= end) {
          const point = add(first, scale(end - position, normalize(vector)));
          segment.push(point);
          segments.push(segment);
          return segments;
        } else {
          segment.push(second);
        }
      }
      position = nextPosition;
    }
    if (segment.length > 0) {
      segments.push(segment);
      segment = [];
    }
  }
  return segments;
};
