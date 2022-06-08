import Shape from './Shape.js';

export const inFn = Shape.chainable(() => (shape) => {
  const geometry = shape.toGeometry();
  if (geometry.type === 'item') {
    return Shape.fromGeometry(geometry.content[0]);
  } else {
    return shape;
  }
});

Shape.registerMethod('in', inFn);
