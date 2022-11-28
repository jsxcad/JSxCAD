import Shape from './Shape.js';

export const toShape = Shape.registerMethod(
  'toShape',
  (value) => async (shape) => {
    if (Shape.isFunction(value)) {
      value = await value(Shape.chain(shape));
    } else {
      value = await value;
    }
    if (Shape.isShape(value)) {
      return value;
    } else {
      throw Error(
        `Expected Function or Shape. Received: ${value.constructor.name}`
      );
    }
  }
);
