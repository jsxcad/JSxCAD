import Shape from './Shape.js';

export const toShape = Shape.registerMethod(
  'toShape',
  (value) => async (shape) => {
    value = await value;
    if (Shape.isFunction(value)) {
      value = await value(shape);
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
