import Shape from './Shape.js';
import { untag } from './untag.js';

export const image = Shape.registerMethod(
  'image',
  (url) => (shape) => untag('image:*').tag(`image:${url}`)(shape)
);
