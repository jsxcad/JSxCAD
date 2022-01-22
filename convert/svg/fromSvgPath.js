import {
  canonicalizePath,
  flipPath,
  isClosedPath,
  isCounterClockwisePath,
  taggedSegments,
  transformPaths,
} from '@jsxcad/geometry';

import absolutifySvgPath from 'abs-svg-path';
import { buildAdaptiveCubicBezierCurve } from './buildAdaptiveCubicBezierCurve.js';
import { curvify as curvifySvgPath } from './curvify-svg-path/index.js';
import { equals } from '@jsxcad/math-vec2';
import { fromScaling } from '@jsxcad/math-mat4';
import parseSvgPath from 'parse-svg-path';
import simplifyPath from 'simplify-path';

const X = 0;
const Y = 1;

const simplify = (path, tolerance) => {
  if (isClosedPath(path)) {
    return simplifyPath(path, tolerance);
  } else {
    return [null, ...simplifyPath(path.slice(1), tolerance)];
  }
};

const removeRepeatedPoints = (path) => {
  const unrepeated = [path[0]];
  for (let nth = 1; nth < path.length; nth++) {
    const last = path[nth - 1];
    const current = path[nth];
    if (last === null || !equals(last, current)) {
      unrepeated.push(current);
    }
  }
  return unrepeated;
};

const toSegments = (
  { curveSegments, normalizeCoordinateSystem = true, tolerance = 0.01 },
  svgPath
) => {
  const segments = [];
  let position;

  const newPath = () => {
    position = undefined;
  };

  const appendPoint = (nextPosition) => {
    if (normalizeCoordinateSystem) {
      nextPosition = [nextPosition[X], -nextPosition[Y]];
    }
    if (!position) {
      position = nextPosition
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
        appendPoint([x, y]);
        break;
      }
      case 'C': {
        const [x1, y1, x2, y2, x, y] = args;
        const [start, end] = (segments.length > 0) ? segments[segments.length - 1] : [[0, 0], [0, 0]];
        const [xStart, yStart] = end;
        for (const [xPoint, yPoint] of buildAdaptiveCubicBezierCurve({ segments: curveSegments }, [
            [xStart, yStart],
            [x1, y1],
            [x2, y2],
            [x, y],
          ])) {
          appendPoint([xPoint, yPoint]);
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
  return taggedSegments({}, segments);
};
