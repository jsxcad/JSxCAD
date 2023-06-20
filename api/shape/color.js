import Shape from './Shape.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';
import { untag } from './untag.js';

export const color = Shape.registerMethod2(
  'color',
  ['input', 'string'],
  (input, name) => untag('color:*').tag(...toTagsFromName(name))(input)
);
