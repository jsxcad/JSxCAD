import Shape from './Shape.js';
import { toShape } from './toShape.js';

export const toShapes = Shape.registerMethod(
  'toShapes',
  (value) => async (shape) => {
    if (Shape.isFunction(value)) {
      value = await value(shape);
    }
    if (Shape.isShape(value)) {
      if (value.toGeometry().type === 'group') {
        const out = [];
        for (const geometry of value.toGeometry().content) {
          out.push(Shape.fromGeometry(geometry));
        }
        return out;
      }
    }
    if (Shape.isArray(value)) {
      const out = [];
      for (const item of value) {
        if (item === undefined) {
          continue;
        }
        out.push(...(await toShapes(item)(shape)));
      }
      return out;
    } else {
      return [await toShape(value)(shape)];
    }
  }
);
