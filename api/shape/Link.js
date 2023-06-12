import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const Link = Shape.registerMethod2(
  'Link',
  ['geometries', 'modes'],
  (geometries, modes) =>
    Shape.fromGeometry(
      linkGeometry(
        geometries,
        modes.includes('close'),
        modes.includes('reverse')
      )
    )
);

export default Link;

export const link = Shape.registerMethod2(
  'link',
  ['input', 'rest'],
  (input, rest) => Link(input, ...rest)(input)
);
