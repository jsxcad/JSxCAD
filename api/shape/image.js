import Shape from './Shape.js';

export const image = Shape.registerMethod(
  'image',
  (url) => (shape) => shape.untag('image:*').tag(`image:${url}`)
);
