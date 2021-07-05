import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { outline as outlineGeometry } from '@jsxcad/geometry';

export const outline = () => (shape) =>
  Group(
    ...outlineGeometry(shape.toGeometry()).map((outline) =>
      Shape.fromGeometry(outline)
    )
  );

Shape.registerMethod('outline', outline);

const withOutline =
  (op = (x) => x) =>
  (shape) =>
    shape.and(op(outline(shape)));

Shape.registerMethod('withOutline', withOutline);
