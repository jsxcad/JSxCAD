import Shape from './Shape.js';
import { untag } from './untag.js';

export const image = Shape.registerMethod2(
  'image',
  ['input', 'string'],
  (input, url) => untag('image:*').tag(`image:${url}`)(input)
);
