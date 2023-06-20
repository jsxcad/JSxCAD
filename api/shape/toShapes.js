/*
import Shape from './Shape.js';
import { toShape } from './toShape.js';

export const toShapes = Shape.registerMethod(
  'toShapes',
  (value) => async (shape) => {
    if (value instanceof Promise) {
      throw Error('toShapes/promise/1');
    }
    if (Shape.isFunction(value)) {
      value = await value(Shape.chain(shape));
    }
    if (value instanceof Promise) {
      throw Error('toShapes/promise/2');
    }
    if (Shape.isShape(value) && value.toGeometry().type === 'group') {
      const out = [];
      for (const geometry of (await value.toGeometry()).content) {
        const item = Shape.fromGeometry(geometry);
        out.push(item);
        if (item instanceof Promise) {
          throw Error('toShapes/promise/2a');
        }
      }
      value = out;
    }
    if (value instanceof Promise) {
      throw Error('toShapes/promise/3');
    }
    if (Shape.isArray(value)) {
      const out = [];
      for (const item of value) {
        if (item === undefined) {
          continue;
        }
        if (item instanceof Promise) {
          throw Error('toShapes/promise/4');
        }
        out.push(...(await toShapes(item)(shape)));
      }
      return out;
    } else {
      if (value instanceof Promise) {
        throw Error('toShapes/promise/5');
      }
      return [await toShape(value)(shape)];
    }
  }
);
*/
