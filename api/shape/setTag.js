import Shape from './Shape.js';

export const setTag = Shape.registerMethod(
  'setTag',
  (tag, value) => (shape) => shape.untag(`${tag}=*`).tag(`${tag}=${value}`)
);

export default setTag;
