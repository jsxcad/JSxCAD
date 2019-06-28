import { divide as divideGeometry, toTransformedGeometry } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';

export const divide = (shape) => Shape.fromGeometry(divideGeometry(toTransformedGeometry(shape.toGeometry())));

Shape.prototype.divide = function () { return divide(this); };
