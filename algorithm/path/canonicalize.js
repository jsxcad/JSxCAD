const vec3 = require('@jsxcad/math-vec3');

const canonicalizePoint = (point, index) => {
  if (point === null) {
    if (index !== 0) throw Error('Path has null not at head');
    return point;
  } else {
    return vec3.canonicalize(point);
  }
};

const canonicalize = (path) => path.map(canonicalizePoint);

module.exports = canonicalize;
