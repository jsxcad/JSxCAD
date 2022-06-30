import Shape from './Shape.js';

export const image = Shape.chainable(
  (url) => (shape) => shape.untag('image:*').tag(`image:${url}`)
);

Shape.registerMethod('image', image);
