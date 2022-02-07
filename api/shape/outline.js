import { Shape } from './Shape.js';
import { outline as outlineGeometry } from '@jsxcad/geometry';

export const outline = () => (shape) =>
  Shape.fromGeometry(outlineGeometry(shape.toGeometry()));

Shape.registerMethod('outline', outline);

const withOutline =
  (op = (x) => x) =>
  (shape) =>
    shape.and(op(outline(shape)));

Shape.registerMethod('withOutline', withOutline);
