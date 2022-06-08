import { Shape } from './Shape.js';
import { outline as outlineGeometry } from '@jsxcad/geometry';

export const outline = Shape.chainable(
  () => (shape) => Shape.fromGeometry(outlineGeometry(shape.toGeometry()))
);

Shape.registerMethod('outline', outline);
