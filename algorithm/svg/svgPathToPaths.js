const absolutifySvgPath = require('abs-svg-path');
const curvifySvgPath = require('curvify-svg-path');
const { buildCubicBezierCurve } = require('@jsxcad/algorithm-shape');
const mat4 = require('@jsxcad/math-mat4');
const parseSvgPath = require('parse-svg-path');
const transformPaths = require('../paths/transform');
const vec2 = require('@jsxcad/math-vec2');

// FIX: Check scaling.

const toPaths = (svgPath) => {
  const paths = [];
  let path = [null];

  const newPath = () => {
    if (path[0] === null) {
      maybeClosePath();
    }
    if (path.length < 2) {
      // An empty path.
      return;
    }
    paths.push(path);
    path = [null];
  };

  const maybeClosePath = () => {
    if (path.length > 3) {
      if (vec2.equals(path[1], path[path.length - 1])) {
        // The path is closed, remove the leading null.
        path = path.slice(1);
        newPath();
      }
    }
  };

  for (const segment of svgPath) {
    const [directive, ...args] = segment;
    switch (directive) {
      case 'M': {
        maybeClosePath();
        newPath();
        const [x, y] = args;
        path.push([x, y]);
        break;
      }
      case 'C': {
        const [x1, y1, x2, y2, x, y] = args;
        const start = path[path.length - 1];
        const [xStart, yStart] = (start === null) ? [0, 0] : start;
        path = path.concat(buildCubicBezierCurve({}, [[xStart, yStart], [x1, y1], [x2, y2], [x, y]]));
        break;
      }
      default: {
        throw Error(`Unexpected segment: ${JSON.stringify(segment)}`);
      }
    }
  }

  maybeClosePath();
  newPath();
  return transformPaths(mat4.fromScaling([1, -1, 0]), paths);
};

const svgPathToPaths = (options = {}, svgPath) => toPaths(curvifySvgPath(absolutifySvgPath(parseSvgPath(svgPath))));

module.exports = svgPathToPaths;
