import Shape from './Shape.js';

export const inFn = Shape.registerMethod2('in', ['input'], async (input) => {
  const geometry = await input.toGeometry();
  if (geometry.type === 'item') {
    return Shape.fromGeometry(geometry.content[0]);
  } else {
    return input;
  }
});
