import { max, min } from '@jsxcad/math-vec3';

import { Assembly } from './Assembly';

export const measureBoundingBox = (shape) => {
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];
  shape.eachPoint({},
                  (point) => {
                    minPoint = min(minPoint, point);
                    maxPoint = max(maxPoint, point);
                  });
  return [minPoint, maxPoint];
}

const method = function () { return measureBoundingBox(this); };

Assembly.prototype.measureBoundingBox = method;
