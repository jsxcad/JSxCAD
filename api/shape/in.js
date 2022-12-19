import Shape from './Shape.js';

export const inFn = Shape.registerMethod('in', () => async (shape) => {
  const geometry = await shape.toGeometry();
  if (geometry.type === 'item') {
    return Shape.fromGeometry(geometry.content[0]);
  } else {
    return shape;
  }
});
