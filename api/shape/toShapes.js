import './toShape.js';

import Shape from './Shape.js';

const toShapeOp = Shape.ops.get('toShape');
let toShapesOp;

export const toShapes = Shape.registerMethod('toShapes', (value) => async (shape) => {
  // console.log(`QQ/toShapes: ${'' + value}`);
  if (Shape.isFunction(value)) {
    // console.log(`QQ/toShapes/0: ${'' + value}`);
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
      out.push(...(await toShapesOp(item)(shape)));
    }
    return out;
  } else {
    return [await toShapeOp(value)(shape)];
  }
});

toShapesOp = Shape.ops.get('toShapes');
