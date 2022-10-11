import Shape from './Shape.js';

export const setTag = Shape.chainable(
  (tag, value) => (shape) => shape.untag(`${tag}=*`).tag(`${tag}=${value}`)
);

export default setTag;

Shape.registerMethod('setTag', setTag);
