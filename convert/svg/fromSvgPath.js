import { Segments, distance, scale } from '@jsxcad/geometry';

import absolutifySvgPath from 'abs-svg-path';
import { buildAdaptiveCubicBezierCurve } from './buildAdaptiveCubicBezierCurve.js';
import { curvify as curvifySvgPath } from './curvify-svg-path/index.js';
import parseSvgPath from 'parse-svg-path';
import simplifyPath from 'simplify-path';

// FIX: Should LOOP_THRESHOLD be adaptive. Does not respect scale.
const LOOP_THRESHOLD = 0.01;
const SOURCE = 0;
const TARGET = 1;
const X = 0;
const Y = 1;

const toSegments = ({ curveSegments, tolerance = 0.01 }, svgPath) => {
  const segments = [];
  let start = 0;
  let position;

  const newPath = () => {
    if (segments.length > 2) {
      const end = segments.length - 1;
      const gap = distance(segments[start][SOURCE], segments[end][TARGET]);
      if (gap > 0 && gap < LOOP_THRESHOLD) {
        // This path looks like it ought to be a closed loop, so make it so.
        segments.push([segments[end][TARGET], segments[start][SOURCE]]);
      }
    }
    position = undefined;
    start = segments.length;
  };

  const appendPoint = (nextPosition) => {
    if (!position) {
      position = nextPosition;
      return;
    }
    if (position[X] === nextPosition[X] && position[Y] === nextPosition[Y]) {
      return;
    }
    segments.push([position, nextPosition]);
    position = nextPosition;
  };

  for (const segment of svgPath) {
    const [directive, ...args] = segment;
    switch (directive) {
      case 'M': {
        newPath();
        const [x, y] = args;
        appendPoint([x, y, 0]);
        break;
      }
      case 'C': {
        const [x1, y1, x2, y2, x, y] = args;
        const [xStart, yStart] = position || [0, 0];
        const path = buildAdaptiveCubicBezierCurve(
          { segments: curveSegments },
          [
            [xStart, yStart],
            [x1, y1],
            [x2, y2],
            [x, y],
          ]
        );
        for (const [x, y] of simplifyPath(path, tolerance)) {
          appendPoint([x, y, 0]);
        }
        break;
      }
      default: {
        throw Error(`Unexpected segment: ${JSON.stringify(segment)}`);
      }
    }
  }

  newPath();

  return segments;
};

export const fromSvgPath = (svgPath, options = {}) => {
  const segments = toSegments(
    options,
    curvifySvgPath(
      absolutifySvgPath(parseSvgPath(new TextDecoder('utf8').decode(svgPath)))
    )
  );
  if (options.normalizeCoordinateSystem) {
    return scale(Segments(segments), [1, -1, 1]);
  } else {
    return Segments(segments);
  }
};
