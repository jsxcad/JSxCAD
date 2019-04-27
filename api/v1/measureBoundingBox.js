import { cutTrianglesByPlane, toTriangles } from '@jsxcad/algorithm-polygons';

import { Assembly } from './Assembly';
import { measureBoundingBox as measureBoundingBoxOfPoints } from '@jsxcad/algorithm-points';

export const measureBoundingBox = (shape) => measureBoundingBoxOfPoints(shape.toPoints());

const method = function () { return measureBoundingBox(this); };

Assembly.prototype.measureBoundingBox = method;
