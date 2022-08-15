import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { outline as outlineGeometry } from '@jsxcad/geometry';

export const outline = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions: selections } = destructure(args);
  return Shape.fromGeometry(
    outlineGeometry(
      shape.toGeometry(),
      shape.toShapes(selections).map((selection) => selection.toGeometry())
    )
  );
});

Shape.registerMethod('outline', outline);
