import { scale, taggedSegments } from '@jsxcad/geometry';

import absolutifySvgPath from 'abs-svg-path';
import { buildAdaptiveCubicBezierCurve } from './buildAdaptiveCubicBezierCurve.js';
import { curvify as curvifySvgPath } from './curvify-svg-path/index.js';
import parseSvgPath from 'parse-svg-path';
import simplifyPath from 'simplify-path';

const X = 0;
const Y = 1;

const toSegments = ({ curveSegments, tolerance = 0.01 }, svgPath) => {
  const segments = [];
  let position;

  const newPath = () => {
    position = undefined;
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
        appendPoint([x, y]);
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
          appendPoint([x, y]);
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
    return scale([1, -1, 0], taggedSegments({}, segments));
  } else {
    return taggedSegments({}, segments);
  }
};
