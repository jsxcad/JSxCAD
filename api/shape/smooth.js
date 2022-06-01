import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth =
  (...args) =>
  (shape) => {
    const { object: options = {}, shapesAndFunctions: selections } =
      destructure(args);
    const { iterations = 1, time = 1 } = options;
    return Shape.fromGeometry(
      smoothGeometry(
        shape.toGeometry(),
        shape.toShapes(selections).map((selection) => selection.toGeometry()),
        iterations,
        time
      )
    );
  };

Shape.registerMethod('smooth', smooth);
