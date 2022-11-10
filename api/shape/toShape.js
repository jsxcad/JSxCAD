import Shape from './Shape.js';

export const toShape = Shape.registerMethod('toShape', (value) => async (shape) => {
  // console.log(`QQ/toShape/1`);
  value = await value;
  // console.log(`QQ/toShape/2`);
  if (Shape.isFunction(value)) {
    value = await value(shape);
  }
  // console.log(`QQ/toShape/3`);
  if (Shape.isShape(value)) {
    return value;
  } else {
    throw Error(`Expected Function or Shape. Received: ${value.constructor.name}`);
  }
});
